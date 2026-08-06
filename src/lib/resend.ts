import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

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
  return resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });
}

export default resend;
