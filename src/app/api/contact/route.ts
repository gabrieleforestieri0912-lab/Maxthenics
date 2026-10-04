import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!message || !String(message).trim()) {
      return NextResponse.json(
        { error: 'Scrivi un messaggio prima di inviare.' },
        { status: 400 }
      );
    }

    const nomePulito = name ? String(name).trim() : '';
    const emailPulita = email ? String(email).trim().toLowerCase() : '';
    const subjectPulito = subject ? String(subject).trim() : 'Feedback';
    const messaggioPulito = String(message).trim();

    if (emailPulita) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailPulita)) {
        return NextResponse.json(
          { error: 'Email non valida.' },
          { status: 400 }
        );
      }
    }

    try {
      await sendEmail({
        to: process.env.CONTACT_EMAIL || 'gabriele.forestieri0912@gmail.com',
        subject: `${subjectPulito}${nomePulito ? ` da ${nomePulito}` : ''}`,
        html: `
          <h2>Nuovo messaggio da Maxthenics</h2>
          <p><strong>Nome:</strong> ${nomePulito || 'Anonimo'}</p>
          <p><strong>Email:</strong> ${emailPulita || 'non fornita'}</p>
          <p><strong>Oggetto:</strong> ${subjectPulito}</p>
          <p><strong>Messaggio:</strong></p>
          <p>${messaggioPulito}</p>
        `,
        from: 'Maxthenics <noreply@maxthenics.com>',
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json(
        { error: 'Errore invio email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json(
      { error: 'Errore del server.' },
      { status: 500 }
    );
  }
}