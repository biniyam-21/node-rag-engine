import { Request, Response, NextFunction } from "express";
import { notificationService } from "../../services/notification.service";

export class ContactController {
  public async handleContactForm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        res.status(400).json({
          success: false,
          message: "Name, email, and message are required.",
        });
        return;
      }

      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Please enter a valid email address.",
        });
        return;
      }

      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
      const userAgent = req.headers["user-agent"] || "";

      const result = await notificationService.sendContactNotification({
        name: String(name).trim(),
        email: String(email).trim(),
        message: String(message).trim(),
        ip,
        userAgent,
      });

      res.status(200).json({
        success: true,
        message: "Message received successfully!",
        channel: result.channel,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const contactController = new ContactController();
