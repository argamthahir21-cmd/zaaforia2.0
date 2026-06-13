import nodemailer from "nodemailer";

export const sendOrderTrackingEmail = async (
  toEmail: string,
  orderId: string,
  trackingNumber: string,
  customerName: string
) => {
  // We use standard SMTP variables. 
  // If they are not set, we will gracefully log the attempt so it doesn't crash the server.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not set. Simulated email sent to:", toEmail, "with tracking:", trackingNumber);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Zaaforia Luxury" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Your Zaaforia Order #${orderId.slice(-8).toUpperCase()} has shipped!`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAFAF8; padding: 40px; text-align: center;">
        <h1 style="color: #2D2D2D; font-weight: 300; letter-spacing: 2px;">ZAAFORIA</h1>
        <hr style="border: none; border-top: 1px solid #D4B06A; margin: 30px 0;" />
        
        <h2 style="color: #2D2D2D; font-size: 24px; font-weight: 400; margin-bottom: 20px;">Great news, ${customerName}!</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
          Your luxury pieces from order <strong>#${orderId.slice(-8).toUpperCase()}</strong> have been dispatched and are on their way to you.
        </p>
        
        <div style="background-color: #FFFFFF; padding: 30px; border: 1px solid #E5E2DE; border-radius: 8px; margin-bottom: 30px;">
          <p style="color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Tracking Number</p>
          <p style="color: #2D2D2D; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 0;">${trackingNumber}</p>
        </div>
        
        <p style="color: #666666; font-size: 14px; margin-bottom: 40px;">
          You can track your order using the courier's website or directly from your Zaaforia profile dashboard.
        </p>
        
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" style="background-color: #D4B06A; color: #FFFFFF; text-decoration: none; padding: 15px 30px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; display: inline-block;">
          Track in Profile
        </a>
        
        <hr style="border: none; border-top: 1px solid #E5E2DE; margin: 40px 0 20px 0;" />
        <p style="color: #999999; font-size: 12px;">© ${new Date().getFullYear()} Zaaforia. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw so we don't crash the tracking update process
  }
};
