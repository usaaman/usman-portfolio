import {
  Bot,
  Brush,
  CloudCog,
  Code2,
  Globe,
  Mail,
  Linkedin,
  MessageCircle,
  Github,
  LayoutDashboard,
} from 'lucide-react'
import type { PortfolioData } from '../types'

export const portfolioData: PortfolioData = {
  hero: {
    name: 'Muhammad Usman',
    tagline: 'Full-Stack Developer | AI Integration Specialist | Video Editor',
    summary:
      'I build intelligent web applications and craft engaging visual stories — turning ideas into functional, beautiful digital products.',
    resumeUrl: '#',
    profileImageUrl: '/profile-placeholder.svg',
  },
  about:
    "I'm Muhammad Usman, a Software Engineering student at Capital University of Science & Technology, Islamabad, currently in my 5th semester. My journey started with a passion for video editing and visual storytelling, which naturally evolved into web development and AI integration. Today, I build full-stack applications with React and Firebase, experiment with AI-powered chat systems, and still keep my creative side alive through video editing and graphic design. I love solving real-world problems — whether that's through clean code or a well-cut video.",
  highlights: [
    { label: 'Cybersecurity' },
    { label: 'Software Engineering' },
    { label: 'Web Development' },
    { label: 'Game Development' },
    { label: 'AI Applications' },
  ],
  skills: [
    {
      id: 'frontend',
      label: 'Frontend Development',
      description: 'Interactive interfaces, reusable component systems, and responsive builds.',
      skills: [
        { name: 'React.js', level: 92 },
        { name: 'JavaScript', level: 90 },
        { name: 'TypeScript', level: 81 },
        { name: 'HTML', level: 96 },
        { name: 'CSS', level: 93 },
        { name: 'Bootstrap', level: 84 },
      ],
    },
    {
      id: 'backend',
      label: 'Backend & Database',
      description: 'Cloud-backed applications and scalable data-driven workflows.',
      skills: [
        { name: 'Firebase', level: 89 },
        { name: 'MySQL', level: 78 },
        { name: 'MongoDB', level: 74 },
        { name: 'PHP', level: 70 },
      ],
    },
    {
      id: 'ai',
      label: 'AI & Integration',
      description: 'Practical AI integrations for chat, media, automation, and cloud workflows.',
      skills: [
        { name: 'AI Integration', level: 88 },
        { name: 'Cloudinary', level: 82 },
        { name: 'Python', level: 80 },
      ],
    },
    {
      id: 'languages',
      label: 'Programming Languages',
      description: 'Strong multi-language foundation for app development and computer science work.',
      skills: [
        { name: 'C++', level: 86 },
        { name: 'C#', level: 76 },
        { name: 'Java', level: 78 },
        { name: 'Python', level: 80 },
      ],
    },
    {
      id: 'design',
      label: 'Design & Video Editing',
      description: 'Creative production for polished visuals, content, and UI storytelling.',
      skills: [
        { name: 'CapCut', level: 94 },
        { name: 'Adobe Photoshop', level: 83 },
        { name: 'Canva', level: 88 },
        { name: 'Blender', level: 68 },
        { name: 'Video Editing', level: 95 },
        { name: 'Graphic Design', level: 86 },
        { name: 'UI Design', level: 82 },
        { name: 'Visual Content Creation', level: 90 },
        { name: 'Painting & Visual Arts', level: 72 },
      ],
    },
    {
      id: 'game',
      label: 'Game Dev & 3D',
      description: 'Interactive prototyping, 3D workflows, and visual design exploration.',
      skills: [
        { name: 'Unity', level: 74 },
        { name: 'Blender', level: 68 },
        { name: '3D Modeling', level: 66 },
        { name: 'Figma', level: 79 },
      ],
    },
    {
      id: 'fundamentals',
      label: 'CS Fundamentals',
      description: 'Core problem-solving, architecture thinking, and technical depth.',
      skills: [
        { name: 'Algorithms', level: 82 },
        { name: 'Data Structures', level: 84 },
        { name: 'Problem Solving', level: 89 },
        { name: 'Networking', level: 72 },
        { name: 'OOP', level: 87 },
        { name: 'System Architecture', level: 76 },
      ],
    },
    {
      id: 'soft',
      label: 'Soft Skills',
      description: 'Strong collaboration, communication, and product-thinking mindset.',
      skills: [
        { name: 'Teamwork', level: 92 },
        { name: 'Design Thinking', level: 85 },
      ],
    },
  ],
  projects: [
    {
      title: 'MedCore POS',
      description:
        'Pharmacy inventory and invoice management system focused on usability, speed, and reliable day-to-day store operations.',
      tech: ['React.js', 'Firebase', 'Tailwind CSS'],
      githubUrl: 'https://github.com/usaaman/medcore-pos/',
      featured: true,
    },
    {
      title: 'AI Chat Application',
      description:
        'Real-time chat application with AI chatbot integration, user messaging, and cloud-based media storage.',
      tech: ['JavaScript', 'Firebase', 'Cloudinary', 'Groq AI'],
      githubUrl: 'https://github.com/usaaman/chatapp/',
      liveUrl: 'https://chatapp-omega-ten.vercel.app/',
      featured: true,
    },
    {
      title: 'Upcoming Project Slot',
      description:
        'This featured card is intentionally reserved for future admin-managed additions and will gracefully expand when new work is published.',
      tech: ['CMS Ready', 'Admin Editable', 'Portfolio'],
      comingSoon: true,
    },
    {
      title: 'Upcoming Project Slot',
      description:
        'Another placeholder for future case studies, freelance builds, or experiments without requiring any UI rewrites.',
      tech: ['Scalable Layout', 'Props Driven', 'Responsive'],
      comingSoon: true,
    },
  ],
  services: [
    {
      title: 'Full-Stack Web Apps',
      description: 'Custom web applications built with modern frontend architecture and practical backend workflows.',
      icon: Globe,
    },
    {
      title: 'Admin Dashboards',
      description: 'Data-driven dashboards, CRUD systems, and CMS-style interfaces designed for real business usage.',
      icon: LayoutDashboard,
    },
    {
      title: 'AI Agent Integration',
      description: 'AI-powered chat systems, workflow automation, and assistant features embedded into web products.',
      icon: Bot,
    },
    {
      title: 'Firebase Solutions',
      description: 'Authentication, Firestore structures, hosting, and scalable cloud features for fast-moving projects.',
      icon: CloudCog,
    },
    {
      title: 'Landing Pages & Frontends',
      description: 'High-converting, animation-rich portfolio, product, and startup interfaces with premium polish.',
      icon: Code2,
    },
    {
      title: 'Video Editing & Graphic Design',
      description: 'CapCut-powered editing, branded social visuals, thumbnails, and motion-led creative support.',
      icon: Brush,
      badge: 'Creative Edge',
    },
  ],
  contactLinks: [
    {
      label: 'Email',
      value: 'musmannazir97@gmail.com',
      href: 'mailto:musmannazir97@gmail.com',
      icon: Mail,
    },
    {
      label: 'GitHub',
      value: 'github.com/usaaman',
      href: 'https://github.com/usaaman/',
      icon: Github,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/muhammad-usman-a76984378',
      href: 'https://www.linkedin.com/in/muhammad-usman-a76984378/',
      icon: Linkedin,
    },
    {
      label: 'WhatsApp',
      value: '0304-5160142',
      href: 'https://wa.me/923045160142',
      icon: MessageCircle,
    },
  ],
  extraProjectsHref: 'https://github.com/usaaman/',
}
