import type { AppLanguage } from "@/i18n";
import type { LegalDocument } from "@/content/legal/types";

const en: LegalDocument = {
  blocks: [
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "This Cookie Policy explains how {{name}} uses cookies and similar technologies on our website. It should be read together with our " },
        { type: "link", to: "/privacy", label: "Privacy Policy" },
        { type: "text", value: "." },
      ],
    },
    { kind: "h2", text: "What are cookies?" },
    {
      kind: "p",
      text: "Cookies are small text files stored on your device when you visit a site. They help the site remember your preferences and keep you signed in securely.",
    },
    { kind: "h2", text: "Cookies we use" },
    {
      kind: "ulRich",
      items: [
        [
          { type: "text", value: "Essential: " },
          { type: "text", value: "authentication tokens and session security so you can log in and use bookings safely." },
        ],
        [
          { type: "text", value: "Preferences: " },
          { type: "text", value: "theme choice (light/dark mode) stored locally as ekri-theme." },
        ],
        [
          { type: "text", value: "Analytics (if enabled): " },
          { type: "text", value: "aggregated usage to improve performance and features — we minimize identifiable tracking." },
        ],
      ],
    },
    { kind: "h2", text: "Third parties" },
    {
      kind: "p",
      text: "Payment pages may set cookies from our payment provider when you complete checkout. Those providers have their own privacy policies.",
    },
    { kind: "h2", text: "Managing cookies" },
    {
      kind: "p",
      text: "You can block or delete cookies in your browser settings. Blocking essential cookies may prevent you from signing in or completing bookings.",
    },
    { kind: "h2", text: "Contact" },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "Questions: " },
        { type: "link", to: "/contact", label: "contact support" },
        { type: "text", value: "." },
      ],
    },
  ],
};

const fr: LegalDocument = {
  blocks: [
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "Cette politique de cookies explique comment {{name}} utilise les cookies et technologies similaires. Elle complète notre " },
        { type: "link", to: "/privacy", label: "Politique de confidentialité" },
        { type: "text", value: "." },
      ],
    },
    { kind: "h2", text: "Que sont les cookies ?" },
    {
      kind: "p",
      text: "Les cookies sont de petits fichiers texte enregistrés sur votre appareil lors d'une visite. Ils permettent de mémoriser vos préférences et de maintenir une connexion sécurisée.",
    },
    { kind: "h2", text: "Cookies utilisés" },
    {
      kind: "ulRich",
      items: [
        [
          { type: "text", value: "Essentiels : " },
          { type: "text", value: "jetons d'authentification et sécurité de session pour vous connecter et réserver en toute sécurité." },
        ],
        [
          { type: "text", value: "Préférences : " },
          { type: "text", value: "choix de thème (clair/sombre) stocké localement (ekri-theme)." },
        ],
        [
          { type: "text", value: "Analytique (si activé) : " },
          { type: "text", value: "statistiques agrégées pour améliorer les performances — nous limitons le suivi identifiable." },
        ],
      ],
    },
    { kind: "h2", text: "Tiers" },
    {
      kind: "p",
      text: "Les pages de paiement peuvent déposer des cookies de notre prestataire lors du règlement. Ces tiers ont leurs propres politiques de confidentialité.",
    },
    { kind: "h2", text: "Gérer les cookies" },
    {
      kind: "p",
      text: "Vous pouvez bloquer ou supprimer les cookies dans les paramètres du navigateur. Bloquer les cookies essentiels peut empêcher la connexion ou la finalisation des réservations.",
    },
    { kind: "h2", text: "Contact" },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "Questions : " },
        { type: "link", to: "/contact", label: "contacter l'assistance" },
        { type: "text", value: "." },
      ],
    },
  ],
};

const ar: LegalDocument = {
  blocks: [
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "توضّح سياسة ملفات تعريف الارتباط هذه كيف تستخدم {{name}} ملفات تعريف الارتباط والتقنيات المشابهة. يُنصح بقراءتها مع " },
        { type: "link", to: "/privacy", label: "سياسة الخصوصية" },
        { type: "text", value: "." },
      ],
    },
    { kind: "h2", text: "ما هي ملفات تعريف الارتباط؟" },
    {
      kind: "p",
      text: "ملفات تعريف الارتباط ملفات نصية صغيرة تُخزَّن على جهازك عند زيارة الموقع. تساعد على تذكر تفضيلاتك والإبقاء على تسجيل دخول آمن.",
    },
    { kind: "h2", text: "ملفات تعريف الارتباط التي نستخدمها" },
    {
      kind: "ulRich",
      items: [
        [
          { type: "text", value: "أساسية: " },
          { type: "text", value: "رموز المصادقة وأمان الجلسة لتسجيل الدخول وإتمام الحجوزات بأمان." },
        ],
        [
          { type: "text", value: "تفضيلات: " },
          { type: "text", value: "اختيار السمة (فاتح/داكن) مخزّن محلياً (ekri-theme)." },
        ],
        [
          { type: "text", value: "تحليلات (إن وُجدت): " },
          { type: "text", value: "استخدام مجمّع لتحسين الأداء والميزات — نقلّل التتبع القابل للتحديد." },
        ],
      ],
    },
    { kind: "h2", text: "أطراف ثالثة" },
    {
      kind: "p",
      text: "قد تضع صفحات الدفع ملفات تعريف ارتباط من مزود الدفع عند إتمام الشراء. لهؤلاء سياسات خصوصية خاصة.",
    },
    { kind: "h2", text: "إدارة ملفات تعريف الارتباط" },
    {
      kind: "p",
      text: "يمكنك حظر أو حذف ملفات تعريف الارتباط من إعدادات المتصفح. حظر الملفات الأساسية قد يمنع تسجيل الدخول أو إتمام الحجوزات.",
    },
    { kind: "h2", text: "التواصل" },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "أسئلة: " },
        { type: "link", to: "/contact", label: "اتصل بالدعم" },
        { type: "text", value: "." },
      ],
    },
  ],
};

export const cookiesDocuments: Record<AppLanguage, LegalDocument> = { en, fr, ar };
