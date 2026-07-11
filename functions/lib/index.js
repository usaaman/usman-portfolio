"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordPageView = exports.summarizeChat = exports.chat = exports.onContactSubmission = exports.submitContact = void 0;
const admin = __importStar(require("firebase-admin"));
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const params_1 = require("firebase-functions/params");
const cors_1 = __importDefault(require("cors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
admin.initializeApp();
const db = admin.firestore();
const deepseekKey = (0, params_1.defineSecret)('DEEPSEEK_API_KEY');
const emailUser = (0, params_1.defineSecret)('EMAIL_USER');
const emailPass = (0, params_1.defineSecret)('EMAIL_PASS');
const ADMIN_EMAIL = 'musmannazir97@gmail.com';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const RATE_LIMIT_WINDOW_MS = 60000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const corsHandler = (0, cors_1.default)({ origin: true });
const rateLimitMap = new Map();
function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.ip ?? 'unknown';
}
function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, windowStart: now });
        return true;
    }
    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }
    entry.count += 1;
    return true;
}
async function sendAdminEmail(subject, html) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) {
        console.warn('Email credentials not configured. Skipping notification.');
        return;
    }
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });
    await transporter.sendMail({
        from: `"Portfolio CMS" <${user}>`,
        to: ADMIN_EMAIL,
        subject,
        html,
    });
}
async function callDeepSeek(apiKey, messages, temperature = 0.7) {
    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages,
            temperature,
            max_tokens: 1500,
        }),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }
    const data = (await response.json());
    return data.choices?.[0]?.message?.content?.trim() ?? 'Sorry, I could not generate a response.';
}
async function buildPortfolioContext() {
    const [heroSnap, aboutSnap, skillsSnap, projectsSnap, servicesSnap] = await Promise.all([
        db.doc('heroContent/main').get(),
        db.doc('about/main').get(),
        db.doc('skills/main').get(),
        db.doc('projects/main').get(),
        db.doc('services/main').get(),
    ]);
    const hero = heroSnap.data() ?? {};
    const about = aboutSnap.data() ?? {};
    const skills = skillsSnap.data()?.items ?? [];
    const projects = projectsSnap.data()?.items ?? [];
    const services = servicesSnap.data()?.items ?? [];
    return `
You are the AI assistant on Muhammad Usman's portfolio website. Answer questions about his background, skills, projects, and freelance services using the context below. Be friendly, professional, and concise. If asked about availability for freelance work, encourage visitors to use the contact form or share their email.

PROFILE:
Name: ${hero.name ?? 'Muhammad Usman'}
Tagline: ${hero.tagline ?? ''}
Summary: ${hero.summary ?? hero.intro ?? ''}

ABOUT:
${about.bio ?? about.text ?? ''}
Highlights: ${(about.highlights ?? []).map((h) => h.label).join(', ')}

SKILLS:
${skills
        .map((s) => `- ${s.category ? `[${s.category}] ` : ''}${s.name}: ${s.percentage ?? s.level ?? 0}%`)
        .join('\n')}

PROJECTS:
${projects
        .map((p) => `- ${p.title} (featured: ${p.featured ?? false}): ${p.description}. Tech: ${(p.techStack ?? p.tech ?? []).join(', ')}. GitHub: ${p.githubUrl ?? 'N/A'}. Live: ${p.liveUrl ?? 'N/A'}`)
        .join('\n')}

SERVICES:
${services
        .map((s) => `- ${s.title}${s.category ? ` (${s.category})` : ''}: ${s.description}`)
        .join('\n')}

CONTACT: musmannazir97@gmail.com | GitHub: github.com/usaaman | LinkedIn: linkedin.com/in/muhammad-usman-a76984378
`.trim();
}
function runWithCors(handler) {
    return (req, res) => {
        corsHandler(req, res, async () => {
            try {
                await handler(req, res);
            }
            catch (error) {
                console.error(error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });
    };
}
exports.submitContact = (0, https_1.onRequest)({ cors: true, secrets: [emailUser, emailPass] }, runWithCors(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const { name, email, message } = req.body ?? {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        res.status(400).json({ error: 'Name, email, and message are required.' });
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        res.status(400).json({ error: 'Invalid email address.' });
        return;
    }
    const docRef = await db.collection('contactSubmissions').add({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        read: false,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(200).json({ success: true, id: docRef.id });
}));
exports.onContactSubmission = (0, firestore_1.onDocumentCreated)({ document: 'contactSubmissions/{docId}', secrets: [emailUser, emailPass] }, async (event) => {
    const data = event.data?.data();
    if (!data)
        return;
    const subject = `New Contact Form: ${data.name}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Message:</strong></p>
      <p>${String(data.message).replace(/\n/g, '<br>')}</p>
      <p><em>Received via portfolio contact form</em></p>
    `;
    await sendAdminEmail(subject, html);
});
exports.chat = (0, https_1.onRequest)({ cors: true, secrets: [deepseekKey] }, runWithCors(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
        res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
        return;
    }
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Messages array is required.' });
        return;
    }
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'Chat service is not configured.' });
        return;
    }
    const context = await buildPortfolioContext();
    const systemMessage = { role: 'system', content: context };
    const reply = await callDeepSeek(apiKey, [systemMessage, ...messages]);
    res.status(200).json({ reply });
}));
exports.summarizeChat = (0, https_1.onRequest)({ cors: true, secrets: [deepseekKey, emailUser, emailPass] }, runWithCors(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
        res.status(429).json({ error: 'Too many requests.' });
        return;
    }
    const { transcript, visitorInfo } = req.body ?? {};
    if (!Array.isArray(transcript) || transcript.length === 0) {
        res.status(400).json({ error: 'Transcript is required.' });
        return;
    }
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: 'Summarization service is not configured.' });
        return;
    }
    const conversationText = transcript
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');
    const summaryPrompt = `Analyze this portfolio chatbot conversation and respond in JSON only with this exact shape:
{"title":"short descriptive title","summary":"concise 2-4 sentence summary"}

Conversation:
${conversationText}`;
    const rawSummary = await callDeepSeek(apiKey, [{ role: 'user', content: summaryPrompt }], 0.3);
    let autoGeneratedTitle = 'Portfolio Chat Inquiry';
    let summaryText = rawSummary;
    try {
        const jsonMatch = rawSummary.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            autoGeneratedTitle = parsed.title ?? autoGeneratedTitle;
            summaryText = parsed.summary ?? summaryText;
        }
    }
    catch {
        summaryText = rawSummary;
    }
    const docRef = await db.collection('chatSummaries').add({
        autoGeneratedTitle,
        summaryText,
        fullTranscript: transcript,
        visitorInfo: visitorInfo ?? null,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    const visitorLine = visitorInfo
        ? `<p><strong>Visitor:</strong> ${visitorInfo.name ?? 'Unknown'} (${visitorInfo.email ?? 'no email'})</p>`
        : '';
    await sendAdminEmail(`Chat Summary: ${autoGeneratedTitle}`, `
        <h2>Chatbot Conversation Summary</h2>
        <p><strong>Title:</strong> ${autoGeneratedTitle}</p>
        ${visitorLine}
        <p><strong>Summary:</strong></p>
        <p>${summaryText}</p>
        <p><em>View full transcript in the admin panel.</em></p>
      `);
    res.status(200).json({ success: true, id: docRef.id, title: autoGeneratedTitle, summary: summaryText });
}));
exports.recordPageView = (0, https_1.onRequest)({ cors: true }, runWithCors(async (_req, res) => {
    const ref = db.doc('analytics/main');
    await db.runTransaction(async (transaction) => {
        const snap = await transaction.get(ref);
        const current = snap.exists ? (snap.data()?.visitorCount ?? 0) : 0;
        transaction.set(ref, {
            visitorCount: current + 1,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    });
    res.status(200).json({ success: true });
}));
//# sourceMappingURL=index.js.map