import nodemailer from 'nodemailer'

const ADMIN_EMAIL = 'musmannazir97@gmail.com'

export async function sendAdminEmail(subject, html) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    console.warn('Email credentials not configured. Skipping notification.')
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `"Portfolio CMS" <${user}>`,
    to: ADMIN_EMAIL,
    subject,
    html,
  })
}
