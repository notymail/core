import * as nodemailer from 'nodemailer';

const TEN_SECONDS_MS = 10 * 1000;

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
      connectionTimeout: process.env.MAIL_TIME_OUT_MS
        ? Number(process.env.MAIL_TIME_OUT_MS)
        : TEN_SECONDS_MS,
      greetingTimeout: process.env.MAIL_TIME_OUT_MS
        ? Number(process.env.MAIL_TIME_OUT_MS)
        : TEN_SECONDS_MS,
      socketTimeout: process.env.MAIL_TIME_OUT_MS
        ? Number(process.env.MAIL_TIME_OUT_MS)
        : TEN_SECONDS_MS,
      dnsTimeout: process.env.MAIL_TIME_OUT_MS
        ? Number(process.env.MAIL_TIME_OUT_MS)
        : TEN_SECONDS_MS,
    })
    .sendMail({
      from: process.env.MAIL_SENDER,
      to,
      subject,
      text,
      html,
    });
}
