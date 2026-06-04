import type { AppLanguage } from "@/i18n";
import type { LegalDocument } from "@/content/legal/types";

const en: LegalDocument = {
  blocks: [
    {
      kind: "p",
      text: '{{name}} ("we", "us") respects your privacy. This Privacy Policy explains what personal data we collect, how we use it, and your choices when you use our website and services in Tunisia and elsewhere.',
    },
    { kind: "h2", text: "1. Data we collect" },
    {
      kind: "ulRich",
      items: [
        [
          { type: "text", value: "Account data: " },
          { type: "text", value: "name, email, phone (optional), password (stored securely), profile photo, bio, location, role (renter/owner), and verification documents for KYC." },
        ],
        [
          { type: "text", value: "Booking data: " },
          { type: "text", value: "rental dates, equipment details, messages, payment status, and delivery information." },
        ],
        [
          { type: "text", value: "Technical data: " },
          { type: "text", value: "IP address, browser type, device information, and cookies needed for security and preferences (including theme)." },
        ],
        [
          { type: "text", value: "Communications: " },
          { type: "text", value: "support requests, reviews, and notifications you receive or send through the platform." },
        ],
      ],
    },
    { kind: "h2", text: "2. How we use your data" },
    { kind: "p", text: "We use personal data to:" },
    {
      kind: "ul",
      items: [
        "Create and manage your account.",
        "Process bookings, payments, and payouts.",
        "Verify identity for owners and prevent fraud.",
        "Send transactional emails (verification, booking updates) and optional push notifications.",
        "Improve the Service, enforce our Terms, and comply with legal obligations.",
      ],
    },
    { kind: "h2", text: "3. Legal basis" },
    {
      kind: "p",
      text: "We process data based on contract performance (providing the Service), legitimate interests (security, analytics, product improvement), consent where required (e.g. marketing), and legal obligations under applicable Tunisian law including personal data protection rules.",
    },
    { kind: "h2", text: "4. Sharing with others" },
    { kind: "p", text: "We may share data with:" },
    {
      kind: "ul",
      items: [
        "Other users, as needed to complete rentals (e.g. name and contact between renter and owner).",
        "Payment processors (e.g. Stripe) to handle transactions.",
        "Cloud hosting and email providers that help us operate the Service.",
        "Authorities when required by law or to protect rights and safety.",
      ],
    },
    { kind: "p", text: "We do not sell your personal data to third-party advertisers." },
    { kind: "h2", text: "5. Retention" },
    {
      kind: "p",
      text: "We keep account and booking records while your account is active and for a reasonable period afterward for legal, tax, and dispute resolution purposes. You may request deletion subject to exceptions (e.g. ongoing bookings or legal holds).",
    },
    { kind: "h2", text: "6. Security" },
    {
      kind: "p",
      text: "We use industry-standard measures including encryption in transit, access controls, and secure password handling. No method of transmission over the internet is 100% secure; use a strong, unique password and protect your login credentials.",
    },
    { kind: "h2", text: "7. Your rights" },
    { kind: "p", text: "Depending on applicable law, you may have the right to:" },
    {
      kind: "ul",
      items: [
        "Access, correct, or delete your personal data.",
        "Object to or restrict certain processing.",
        "Withdraw consent where processing is consent-based.",
        "Lodge a complaint with a supervisory authority.",
      ],
    },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "To exercise these rights, contact us via the " },
        { type: "link", to: "/contact", label: "support form" },
        { type: "text", value: " or your account profile settings where available." },
      ],
    },
    { kind: "h2", text: "8. International transfers" },
    {
      kind: "p",
      text: "Some service providers may process data outside Tunisia. We ensure appropriate safeguards where required by law.",
    },
    { kind: "h2", text: "9. Children" },
    { kind: "p", text: "The Service is not directed at children under 18. We do not knowingly collect their data." },
    { kind: "h2", text: "10. Changes" },
    {
      kind: "p",
      text: 'We may update this policy. The "Last updated" date will change when we do. Material changes may be communicated by email or in-app notice.',
    },
  ],
};

const fr: LegalDocument = {
  blocks: [
    {
      kind: "p",
      text: "{{name}} (« nous ») respecte votre vie privée. Cette politique explique quelles données personnelles nous collectons, comment nous les utilisons et vos choix lorsque vous utilisez notre site et nos services en Tunisie et ailleurs.",
    },
    { kind: "h2", text: "1. Données collectées" },
    {
      kind: "ulRich",
      items: [
        [
          { type: "text", value: "Données de compte : " },
          { type: "text", value: "nom, e-mail, téléphone (facultatif), mot de passe (stocké de façon sécurisée), photo de profil, bio, localisation, rôle (locataire/propriétaire) et documents de vérification KYC." },
        ],
        [
          { type: "text", value: "Données de réservation : " },
          { type: "text", value: "dates, détails du matériel, messages, statut de paiement et informations de livraison." },
        ],
        [
          { type: "text", value: "Données techniques : " },
          { type: "text", value: "adresse IP, navigateur, appareil et cookies nécessaires à la sécurité et aux préférences (dont le thème)." },
        ],
        [
          { type: "text", value: "Communications : " },
          { type: "text", value: "demandes d'assistance, avis et notifications envoyées ou reçues via la plateforme." },
        ],
      ],
    },
    { kind: "h2", text: "2. Utilisation des données" },
    { kind: "p", text: "Nous utilisons les données personnelles pour :" },
    {
      kind: "ul",
      items: [
        "Créer et gérer votre compte.",
        "Traiter réservations, paiements et versements.",
        "Vérifier l'identité des propriétaires et prévenir la fraude.",
        "Envoyer des e-mails transactionnels et des notifications push facultatives.",
        "Améliorer le Service, faire respecter nos Conditions et respecter les obligations légales.",
      ],
    },
    { kind: "h2", text: "3. Base légale" },
    {
      kind: "p",
      text: "Nous traitons les données sur la base de l'exécution du contrat, de nos intérêts légitimes (sécurité, analyse, amélioration), du consentement lorsque requis et des obligations légales tunisiennes en matière de protection des données.",
    },
    { kind: "h2", text: "4. Partage avec des tiers" },
    { kind: "p", text: "Nous pouvons partager des données avec :" },
    {
      kind: "ul",
      items: [
        "D'autres utilisateurs, si nécessaire pour finaliser une location.",
        "Des prestataires de paiement (ex. Stripe).",
        "Des hébergeurs cloud et fournisseurs d'e-mail.",
        "Les autorités lorsque la loi l'exige ou pour protéger des droits et la sécurité.",
      ],
    },
    { kind: "p", text: "Nous ne vendons pas vos données personnelles à des annonceurs tiers." },
    { kind: "h2", text: "5. Conservation" },
    {
      kind: "p",
      text: "Nous conservons les données de compte et de réservation pendant la vie du compte puis une durée raisonnable pour obligations légales, fiscales et litiges. Vous pouvez demander la suppression sous réserve d'exceptions (réservations en cours, obligations légales).",
    },
    { kind: "h2", text: "6. Sécurité" },
    {
      kind: "p",
      text: "Nous utilisons le chiffrement en transit, des contrôles d'accès et une gestion sécurisée des mots de passe. Aucune transmission sur Internet n'est totalement sûre ; utilisez un mot de passe fort et unique.",
    },
    { kind: "h2", text: "7. Vos droits" },
    { kind: "p", text: "Selon la loi applicable, vous pouvez avoir le droit de :" },
    {
      kind: "ul",
      items: [
        "Accéder, rectifier ou supprimer vos données.",
        "Vous opposer à certains traitements ou les limiter.",
        "Retirer votre consentement lorsque le traitement en dépend.",
        "Introduire une réclamation auprès d'une autorité de contrôle.",
      ],
    },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "Pour exercer ces droits : " },
        { type: "link", to: "/contact", label: "formulaire d'assistance" },
        { type: "text", value: " ou les paramètres de profil lorsque disponibles." },
      ],
    },
    { kind: "h2", text: "8. Transferts internationaux" },
    {
      kind: "p",
      text: "Certains prestataires peuvent traiter des données hors Tunisie. Nous mettons en place des garanties appropriées lorsque la loi l'exige.",
    },
    { kind: "h2", text: "9. Enfants" },
    { kind: "p", text: "Le Service ne s'adresse pas aux moins de 18 ans. Nous ne collectons pas sciemment leurs données." },
    { kind: "h2", text: "10. Modifications" },
    {
      kind: "p",
      text: "Nous pouvons mettre à jour cette politique. La date de dernière mise à jour sera modifiée. Les changements importants peuvent être communiqués par e-mail ou notification dans l'application.",
    },
  ],
};

const ar: LegalDocument = {
  blocks: [
    {
      kind: "p",
      text: 'تحترم {{name}} ("نحن") خصوصيتك. توضّح سياسة الخصوصية هذه البيانات التي نجمعها وكيف نستخدمها وخياراتك عند استخدام موقعنا وخدماتنا في تونس وغيرها.',
    },
    { kind: "h2", text: "1. البيانات التي نجمعها" },
    {
      kind: "ulRich",
      items: [
        [
          { type: "text", value: "بيانات الحساب: " },
          { type: "text", value: "الاسم، البريد، الهاتف (اختياري)، كلمة المرور (مخزّنة بأمان)، الصورة، السيرة، الموقع، الدور (مستأجر/مالك)، ووثائق التحقق من الهوية." },
        ],
        [
          { type: "text", value: "بيانات الحجز: " },
          { type: "text", value: "التواريخ، تفاصيل المعدات، الرسائل، حالة الدفع ومعلومات التسليم." },
        ],
        [
          { type: "text", value: "بيانات تقنية: " },
          { type: "text", value: "عنوان IP، المتصفح، الجهاز وملفات تعريف الارتباط للأمان والتفضيلات (بما في ذلك السمة)." },
        ],
        [
          { type: "text", value: "التواصل: " },
          { type: "text", value: "طلبات الدعم، التقييمات والإشعارات المرسلة أو المستلمة عبر المنصة." },
        ],
      ],
    },
    { kind: "h2", text: "2. كيف نستخدم بياناتك" },
    { kind: "p", text: "نستخدم البيانات الشخصية من أجل:" },
    {
      kind: "ul",
      items: [
        "إنشاء حسابك وإدارته.",
        "معالجة الحجوزات والمدفوعات والتحويلات.",
        "التحقق من هوية المالكين ومنع الاحتيال.",
        "إرسال رسائل تأكيد وتحديثات الحجز وإشعارات اختيارية.",
        "تحسين الخدمة، تطبيق الشروط والامتثال للالتزامات القانونية.",
      ],
    },
    { kind: "h2", text: "3. الأساس القانوني" },
    {
      kind: "p",
      text: "نعالج البيانات لتنفيذ العقد، لمصالحنا المشروعة (الأمان، التحليل، التحسين)، بناءً على الموافقة عند الحاجة، وللالتزامات القانونية بموجب قانون حماية المعطيات التونسي.",
    },
    { kind: "h2", text: "4. المشاركة مع آخرين" },
    { kind: "p", text: "قد نشارك البيانات مع:" },
    {
      kind: "ul",
      items: [
        "مستخدمين آخرين عند الحاجة لإتمام الإيجار (مثل الاسم والاتصال بين المستأجر والمالك).",
        "معالجي الدفع (مثل Stripe).",
        "مزودي الاستضافة والبريد الإلكتروني.",
        "السلطات عندما يقتضي القانون ذلك أو لحماية الحقوق والسلامة.",
      ],
    },
    { kind: "p", text: "لا نبيع بياناتك الشخصية لمعلنين خارجيين." },
    { kind: "h2", text: "5. الاحتفاظ" },
    {
      kind: "p",
      text: "نحتفظ بسجلات الحساب والحجز طوال نشاط الحساب وفترة معقولة بعدها لأغراض قانونية وضريبية وتسوية النزاعات. يمكنك طلب الحذف مع استثناءات (حجوزات جارية، التزامات قانونية).",
    },
    { kind: "h2", text: "6. الأمان" },
    {
      kind: "p",
      text: "نستخدم التشفير أثناء النقل وضوابط الوصول ومعالجة آمنة لكلمات المرور. لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100%؛ استخدم كلمة مرور قوية وفريدة.",
    },
    { kind: "h2", text: "7. حقوقك" },
    { kind: "p", text: "حسب القانون المعمول به، قد يكون لك الحق في:" },
    {
      kind: "ul",
      items: [
        "الوصول إلى بياناتك أو تصحيحها أو حذفها.",
        "الاعتراض على معالجة معينة أو تقييدها.",
        "سحب الموافقة عندما تكون المعالجة مبنية عليها.",
        "تقديم شكوى لدى جهة رقابية.",
      ],
    },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "لممارسة هذه الحقوق: " },
        { type: "link", to: "/contact", label: "نموذج الدعم" },
        { type: "text", value: " أو إعدادات الملف عند توفرها." },
      ],
    },
    { kind: "h2", text: "8. التحويلات الدولية" },
    {
      kind: "p",
      text: "قد يعالج بعض المزودين البيانات خارج تونس. نضمن ضمانات مناسبة عندما يقتضي القانون ذلك.",
    },
    { kind: "h2", text: "9. الأطفال" },
    { kind: "p", text: "الخدمة غير موجهة لمن دون 18 عاماً. لا نجمع بياناتهم عن قصد." },
    { kind: "h2", text: "10. التعديلات" },
    {
      kind: "p",
      text: 'يجوز لنا تحديث هذه السياسة. سيُغيَّر تاريخ "آخر تحديث" عند التعديل. قد نُبلغ بالتغييرات الجوهرية عبر البريد أو إشعار داخل التطبيق.',
    },
  ],
};

export const privacyDocuments: Record<AppLanguage, LegalDocument> = { en, fr, ar };
