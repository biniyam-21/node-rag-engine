import { env } from "../config/env";

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
  ip?: string;
  userAgent?: string;
}

export class NotificationService {
  /**
   * Send instant notification when a portfolio visitor sends a contact message
   */
  public async sendContactNotification(payload: ContactMessagePayload): Promise<{ success: boolean; channel: string }> {
    const { name, email, message, ip } = payload;
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" });

    const botToken = process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID;

    // Clean HTML escape helper
    const escapeHtml = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Format clean HTML message for Telegram
    const formattedHtml = 
`📥 <b>New Contact Form Submission!</b>

👤 <b>From:</b> ${escapeHtml(name)}
📧 <b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
⏰ <b>Time:</b> ${escapeHtml(timestamp)}
${ip ? `🌐 <b>IP:</b> <code>${escapeHtml(ip)}</code>\n` : ""}
💬 <b>Message:</b>
<i>${escapeHtml(message)}</i>`;

    // Try Telegram Notification first if credentials are configured
    if (botToken && chatId) {
      try {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: formattedHtml,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        });

        const data = await response.json() as { ok?: boolean; description?: string };
        if (data.ok) {
          console.log(`[NotificationService] Telegram alert sent successfully for message from ${email}`);
          return { success: true, channel: "telegram" };
        } else {
          console.warn(`[NotificationService] Telegram API error: ${data.description}. Falling back to console logging.`);
        }
      } catch (error) {
        console.error("[NotificationService] Error sending Telegram message:", error);
      }
    } else {
      console.log("[NotificationService] Telegram credentials not set in .env. Logged message locally:");
    }

    // Fallback: Log message to console cleanly so no user message is lost
    console.log(`\n========================================`);
    console.log(`📩 NEW CONTACT FORM SUBMISSION`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Message: ${message}`);
    console.log(`========================================\n`);

    return { success: true, channel: "console_fallback" };
  }

  /**
   * Send instant Telegram push alert when someone likes a blog post
   */
  public async sendBlogLikeNotification(blogTitle: string, totalLikes: number): Promise<boolean> {
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" });
    const botToken = process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID;

    const escapeHtml = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const text = 
`❤️ <b>New Blog Like!</b>

📚 <b>Blog Post:</b> <i>${escapeHtml(blogTitle)}</i>
🔥 <b>Total Likes:</b> <code>${totalLikes}</code>
⏰ <b>Time:</b> ${escapeHtml(timestamp)}`;

    if (botToken && chatId) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
        });

        const data = (await response.json()) as { ok?: boolean };
        if (data.ok) {
          console.log(`[NotificationService] Telegram like notification sent for blog: "${blogTitle}"`);
          return true;
        }
      } catch (error) {
        console.error("[NotificationService] Failed to send Telegram blog like notification:", error);
      }
    }

    console.log(`❤️ BLOG LIKED: "${blogTitle}" | Total Likes: ${totalLikes}`);
    return false;
  }
}

export const notificationService = new NotificationService();
