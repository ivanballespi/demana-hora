import "server-only";
import { appUrl } from "@/lib/env";
import { dateLong, euros, timeShort } from "@/lib/format";
import type { Booking, Business } from "@/lib/types";

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email no enviat: falta RESEND_API_KEY] ${to} · ${subject}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Senyal <hola@senyal.cat>",
      to,
      subject,
      html,
      reply_to: replyTo,
    }),
  });
  if (!res.ok) console.error("Error enviant correu", res.status, await res.text());
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(body: string) {
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1c1917;line-height:1.5">${body}<p style="margin-top:32px;font-size:12px;color:#78716c">Reserves gestionades amb <a href="${appUrl()}" style="color:#78716c">Senyal</a></p></div>`;
}

function when(b: Booking, biz: Business) {
  return `${dateLong(b.starts_at, biz.timezone)} a les ${timeShort(b.starts_at, biz.timezone)}`;
}

const manageUrl = (b: Booking) => `${appUrl()}/reserva/${b.id}?t=${b.cancel_token}`;

export async function sendBookingConfirmed(b: Booking, biz: Business) {
  const deposit = b.deposit_cents
    ? `<p>Has pagat <b>${euros(b.deposit_cents)}</b> de paga i senyal, que es descomptaran del preu final (${euros(b.price_cents)}). Pots cancel·lar gratis fins a ${biz.cancel_hours} h abans i et retornem la paga i senyal.</p>`
    : "";
  await send(
    b.customer_email,
    `Reserva confirmada · ${biz.name}`,
    layout(`<h2 style="margin:0 0 8px">Tens hora! ✅</h2>
<p><b>${esc(b.service_name)}</b> a <b>${esc(biz.name)}</b><br>${when(b, biz)}</p>
${biz.address ? `<p>📍 ${esc(biz.address)}</p>` : ""}
${deposit}
<p><a href="${manageUrl(b)}" style="display:inline-block;background:#1c1917;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Veure o cancel·lar la reserva</a></p>`),
    biz.email,
  );
  await send(
    biz.email,
    `Nova reserva: ${b.customer_name} · ${timeShort(b.starts_at, biz.timezone)}`,
    layout(`<h2 style="margin:0 0 8px">Nova reserva 🎉</h2>
<p><b>${esc(b.customer_name)}</b> · ${esc(b.customer_phone)} · ${esc(b.customer_email)}</p>
<p>${esc(b.service_name)} · ${when(b, biz)}</p>
${b.deposit_cents ? `<p>Paga i senyal cobrada: <b>${euros(b.deposit_cents)}</b></p>` : ""}
<p><a href="${appUrl()}/panell">Obrir el panell</a></p>`),
    b.customer_email,
  );
}

export async function sendReminder(b: Booking, biz: Business) {
  await send(
    b.customer_email,
    `Recordatori: demà tens hora a ${biz.name}`,
    layout(`<h2 style="margin:0 0 8px">Ens veiem demà 👋</h2>
<p><b>${esc(b.service_name)}</b> a <b>${esc(biz.name)}</b><br>${when(b, biz)}</p>
${biz.address ? `<p>📍 ${esc(biz.address)}</p>` : ""}
<p>Si no pots venir, cancel·la-ho perquè algú altre aprofiti l'hora:</p>
<p><a href="${manageUrl(b)}">Gestionar la reserva</a></p>`),
    biz.email,
  );
}

export async function sendCancelled(b: Booking, biz: Business, by: "client" | "business") {
  const refund = b.refunded && b.deposit_cents ? `Et retornem ${euros(b.deposit_cents)} (pot trigar 5-10 dies a aparèixer).` : "";
  await send(
    b.customer_email,
    `Reserva cancel·lada · ${biz.name}`,
    layout(`<h2 style="margin:0 0 8px">Reserva cancel·lada</h2>
<p>${esc(b.service_name)} · ${when(b, biz)}</p><p>${refund}</p>`),
    biz.email,
  );
  if (by === "client") {
    await send(
      biz.email,
      `Cancel·lació: ${b.customer_name} · ${timeShort(b.starts_at, biz.timezone)}`,
      layout(`<p><b>${esc(b.customer_name)}</b> ha cancel·lat ${esc(b.service_name)} (${when(b, biz)}).</p>
<p>${b.refunded ? "Ha cancel·lat a temps i se li ha retornat la paga i senyal." : b.deposit_cents ? `Ha cancel·lat fora de termini: et quedes la paga i senyal (${euros(b.deposit_cents)}).` : ""}</p>
<p>L'hora torna a estar lliure a la teva pàgina de reserves.</p>`),
    );
  }
}
