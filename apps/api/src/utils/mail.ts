import * as nodemailer from 'nodemailer';

export default function sendMail(
  to: string | string[],
  subject: string,
  html?: string,
  text?: string,
) {
  return nodemailer
    .createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASSWORD,
      },
    })
    .sendMail({
      from: process.env.MAIL_SENDER,
      to,
      subject,
      text,
      html,
    });
}
