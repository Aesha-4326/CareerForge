const sendEmail = async ({ to, subject, text }) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.info(`Email not sent because RESEND_API_KEY or EMAIL_FROM is missing. Intended recipient: ${to}`);
    return { delivered: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, text })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Email provider rejected the request: ${details}`);
  }

  return { delivered: true };
};

module.exports = { sendEmail };
