import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req) {
  try {
    const { mensagem } = await req.json();
    await resend.emails.send({
      from: "Seu Site <onboarding@resend.dev>",
      to: "seuemail@gmail.com",
      subject: "Nova dúvida enviada pelo site",
      text: mensagem,
    });return Response.json({ sucesso: true });
  } catch (error) {return Response.json({ sucesso: false, error })}
}