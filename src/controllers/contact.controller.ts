import { Response, Request } from "express";
import Contact from "../models/contact.model";
import { sendContactEmail } from "../services/mail.service";

type ContactBody = {
  email: string;
  firstName: string;
  lastName: string;
  subject: string;
  message: string;
};

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const contactController = {
  sendMail: async function (
    req: Request<unknown, unknown, ContactBody>,
    res: Response
  ): Promise<void> {
    const { email, firstName, lastName, subject, message } = req.body;

    try {
      if (!isNonEmptyString(email) || !isEmail(email)) {
        res.status(400).json({ error: "A valid 'email' is required." });
        return;
      }

      if (!isNonEmptyString(firstName)) {
        res.status(400).json({ error: "A valid 'firstName' is required." });
        return;
      }

      if (!isNonEmptyString(lastName)) {
        res.status(400).json({ error: "A valid 'lastName' is required." });
        return;
      }

      if (!isNonEmptyString(subject)) {
        res.status(400).json({ error: "A valid 'subject' is required." });
        return;
      }

      if (!isNonEmptyString(message)) {
        res.status(400).json({ error: "A valid 'message' is required." });
        return;
      }

      await sendContactEmail(
        email.trim(),
        firstName.trim(),
        lastName.trim(),
        subject.trim(),
        message.trim()
      );

      const emailNorm = email.trim().toLowerCase();

      const existingContact = await Contact.findOne({ email: emailNorm })
        .lean()
        .exec();

      if (!existingContact) {
        await Contact.create({
          email: emailNorm,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
      }

      res.status(200).json({ message: "Contact email sent successfully." });
    } catch (err: unknown) {
      console.error("sendMail failed:", err);

      const message =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ error: message });
    }
  },

  retrieveContacts: async function (req: Request, res: Response) {
    try {
      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      res.status(200).json({ contacts });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
};
