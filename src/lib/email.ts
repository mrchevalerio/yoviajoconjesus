import { Resend } from "resend";

export interface ConfirmationEmailData {
  lang: "es" | "en";
  reference: string;
  email: string;
  name: string;
  address: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  fare: number;
}

const COPY = {
  es: {
    subject: (reference: string) => `Confirmación de tu viaje — ${reference}`,
    heading: "¡Tu viaje está confirmado!",
    greeting: (name: string) => `Hola ${name},`,
    intro: "Aquí tienes los detalles de tu viaje al JFK:",
    reference: "Número de confirmación",
    address: "Dirección de recogida",
    when: "Fecha y hora",
    passengers: "Pasajeros",
    luggage: "Maletas",
    fare: "Tarifa",
    footer: "Nos pondremos en contacto antes de tu recogida. Si tienes preguntas o necesitas hacer cambios, escríbenos por WhatsApp al (347) 460-6696.",
    signature: "— Yo Viajo con Jesus",
  },
  en: {
    subject: (reference: string) => `Your ride confirmation — ${reference}`,
    heading: "Your ride is confirmed!",
    greeting: (name: string) => `Hi ${name},`,
    intro: "Here are the details for your ride to JFK:",
    reference: "Confirmation number",
    address: "Pickup address",
    when: "Date & time",
    passengers: "Passengers",
    luggage: "Luggage",
    fare: "Fare",
    footer: "We'll be in touch before pickup. If you have questions or need to make changes, message us on WhatsApp at (347) 460-6696.",
    signature: "— Yo Viajo con Jesus",
  },
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailHtml(data: ConfirmationEmailData): string {
  const c = COPY[data.lang] ?? COPY.en;
  const name = escapeHtml(data.name);
  const address = escapeHtml(data.address);
  const reference = escapeHtml(data.reference);
  const date = escapeHtml(data.date);
  const time = escapeHtml(data.time);

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #101b26;">
      <h1 style="font-size: 22px; margin-bottom: 8px;">${c.heading}</h1>
      <p>${c.greeting(name)}</p>
      <p>${c.intro}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; color: #5b6b7a;">${c.reference}</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">${reference}</td></tr>
        <tr><td style="padding: 6px 0; color: #5b6b7a;">${c.address}</td><td style="padding: 6px 0; text-align: right;">${address}</td></tr>
        <tr><td style="padding: 6px 0; color: #5b6b7a;">${c.when}</td><td style="padding: 6px 0; text-align: right;">${date} · ${time}</td></tr>
        <tr><td style="padding: 6px 0; color: #5b6b7a;">${c.passengers}</td><td style="padding: 6px 0; text-align: right;">${data.passengers}</td></tr>
        <tr><td style="padding: 6px 0; color: #5b6b7a;">${c.luggage}</td><td style="padding: 6px 0; text-align: right;">${data.luggage}</td></tr>
        <tr><td style="padding: 6px 0; color: #5b6b7a; font-weight: 600;">${c.fare}</td><td style="padding: 6px 0; text-align: right; font-weight: 600;">$${data.fare}</td></tr>
      </table>
      <p style="color: #5b6b7a; font-size: 14px;">${c.footer}</p>
      <p>${c.signature}</p>
    </div>
  `;
}

/**
 * Real integration point: set RESEND_API_KEY in .env.local (+ RESEND_FROM_EMAIL
 * once a custom domain is verified in Resend) to start sending real
 * confirmation emails. Until then this no-ops so the booking flow never
 * blocks on it.
 */
export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Yo Viajo con Jesus <onboarding@resend.dev>";
  const copy = COPY[data.lang] ?? COPY.en;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: copy.subject(data.reference),
      html: renderEmailHtml(data),
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}
