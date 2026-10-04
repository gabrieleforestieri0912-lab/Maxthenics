import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || '');
  }
  return resend;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Maxthenics <noreply@maxthenics.com>',
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  return getResend().emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });
}

export default getResend;
