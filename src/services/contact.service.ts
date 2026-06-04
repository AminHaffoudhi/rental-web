import { api, unwrap } from "@/services/api";

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type?: "CONTACT" | "REPORT";
};

export async function submitContactForm(
  data: ContactFormData
): Promise<{ id: string; message: string }> {
  const res = await api.post("/contact", {
    ...data,
    phone: data.phone?.trim() || undefined,
    subject: data.subject?.trim() || undefined,
    type: data.type ?? "CONTACT",
  });
  return unwrap(res);
}
