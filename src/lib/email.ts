import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'CyberUz Academy'}" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export function emailVerifyTemplate(verifyUrl: string, name?: string): string {
  return `
    <div style="background: #0A0A0A; color: #fff; padding: 40px; font-family: Arial;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; padding: 30px; border-radius: 10px; border: 2px solid #06B6D4;">
        <h1 style="color: #06B6D4; text-align: center;">🛡️ CyberUz Academy</h1>
        <h2 style="color: #FBBF24;">Salom${name ? `, ${name}` : ''}!</h2>
        <p>CyberUz Academy'ga xush kelibsiz!</p>
        <p>Email manzilingizni tasdiqlash uchun quyidagi tugmani bosing:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #2563EB; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Emailni Tasdiqlash
          </a>
        </div>
        <p style="color: #888;">Yoki quyidagi havolani ko'chiring:</p>
        <p style="color: #06B6D4; word-break: break-all;">${verifyUrl}</p>
      </div>
    </div>
  `;
}

export function passwordResetTemplate(resetUrl: string, name?: string): string {
  return `
    <div style="background: #0A0A0A; color: #fff; padding: 40px; font-family: Arial;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; padding: 30px; border-radius: 10px; border: 2px solid #FBBF24;">
        <h1 style="color: #FBBF24; text-align: center;">🔐 Parolni Tiklash</h1>
        <p>Salom${name ? `, ${name}` : ''}!</p>
        <p>Parolingizni tiklash uchun quyidagi havolani bosing:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #FBBF24; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Parolni Tiklash
          </a>
        </div>
        <p style="color: #888;">Bu havola 1 soat ichida amal qiladi.</p>
      </div>
    </div>
  `;
}

export function welcomeEmailTemplate(name: string): string {
  return `
    <div style="background: #0A0A0A; color: #fff; padding: 40px; font-family: Arial;">
      <div style="max-width: 600px; margin: 0 auto; background: #111827; padding: 30px; border-radius: 10px; border: 2px solid #06B6D4;">
        <h1 style="color: #06B6D4; text-align: center;">🛡️ CyberUz Academy</h1>
        <h2 style="color: #FBBF24;">Xush kelibsiz, ${name}!</h2>
        <p>Siz muvaffaqiyatli ro'yxatdan o'tdingiz. Endi siz:</p>
        <ul style="color: #06B6D4;">
          <li>10 ta o'rganish yo'liga kirish</li>
          <li>Bepul darslar</li>
          <li>AI o'qituvchi bilan suhbat</li>
          <li>Sertifikat olish imkoniyatiga egasiz</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #06B6D4; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            O'rganishni Boshlash
          </a>
        </div>
      </div>
    </div>
  `;
}
