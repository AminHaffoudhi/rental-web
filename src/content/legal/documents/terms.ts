import type { AppLanguage } from "@/i18n";
import type { LegalDocument } from "@/content/legal/types";

const en: LegalDocument = {
  blocks: [
    {
      kind: "p",
      text: 'These Terms of Service ("Terms") govern your access to and use of the {{name}} platform, website, and related services (collectively, the "Service"). By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.',
    },
    { kind: "h2", text: "1. About {{name}}" },
    {
      kind: "p",
      text: '{{name}} is an online marketplace that connects equipment owners ("Owners") with individuals or businesses seeking to rent equipment ("Renters") in Tunisia. We facilitate discovery, booking requests, payments, and communication but are not a party to the rental contract between Owner and Renter unless explicitly stated.',
    },
    { kind: "h2", text: "2. Eligibility and accounts" },
    {
      kind: "ul",
      items: [
        "You must be at least 18 years old and able to enter a binding contract.",
        "You must provide accurate registration information and keep your account secure.",
        "Owners who list equipment may be required to complete identity verification (KYC) before listings go live.",
        "We may suspend or terminate accounts that violate these Terms or applicable law.",
      ],
    },
    { kind: "h2", text: "3. Listings and bookings" },
    {
      kind: "p",
      text: "Owners are responsible for the accuracy of listings, including photos, pricing in Tunisian dinar (TND), availability, location, deposit requirements, and equipment condition. Renters submit booking requests for specific dates; Owners may approve or decline. A booking is confirmed only when both parties complete the steps shown in the booking workflow (including payment where required).",
    },
    {
      kind: "ul",
      items: [
        "Renters must use equipment only for lawful purposes and return it in agreed condition.",
        "Security deposits may be held and released after inspection, subject to dispute rules.",
        "Platform fees apply as displayed at checkout and in the price breakdown.",
      ],
    },
    { kind: "h2", text: "4. Payments" },
    {
      kind: "p",
      text: "Payments are processed through our payment partners. Prices are shown in TND unless otherwise stated. You authorize us and our payment providers to charge amounts for rentals, fees, and deposits according to the booking summary. Failed or disputed payments may result in cancellation or account restrictions.",
    },
    { kind: "h2", text: "5. Cancellations, disputes, and refunds" },
    {
      kind: "p",
      text: "Cancellation and refund eligibility depend on booking status and the reason for cancellation. Either party may raise a dispute through the Service for issues such as non-delivery, damage, or misrepresentation. We may review disputes and take action on accounts or payouts, but we do not guarantee a particular outcome. Nothing in these Terms limits your statutory rights under Tunisian consumer law where applicable.",
    },
    { kind: "h2", text: "6. Reviews and content" },
    {
      kind: "p",
      text: "You may submit reviews and other content. You grant {{name}} a non-exclusive license to use, display, and moderate that content on the Service. Do not post false, offensive, or infringing material. We may remove content at our discretion.",
    },
    { kind: "h2", text: "7. Prohibited conduct" },
    { kind: "p", text: "You agree not to:" },
    {
      kind: "ul",
      items: [
        "Circumvent the platform to avoid fees or safety measures.",
        "List stolen, unsafe, or illegal equipment.",
        "Harass other users or misuse personal data obtained through the Service.",
        "Attempt to disrupt, scrape, or reverse-engineer the Service.",
      ],
    },
    { kind: "h2", text: "8. Liability" },
    {
      kind: "p",
      text: 'The Service is provided "as is" to the extent permitted by law. {{name}} is not liable for indirect or consequential damages arising from rentals between users. Our total liability to you for claims related to the Service is limited to the fees you paid to us in the twelve months before the claim, except where law prohibits such limitation.',
    },
    { kind: "h2", text: "9. Changes" },
    {
      kind: "p",
      text: 'We may update these Terms. We will post the revised version on the Service and update the "Last updated" date. Continued use after changes constitutes acceptance of the revised Terms.',
    },
    { kind: "h2", text: "10. Contact" },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "Questions about these Terms: use our " },
        { type: "link", to: "/contact", label: "contact form" },
        { type: "text", value: " or the support channels listed on the website." },
      ],
    },
  ],
};

const fr: LegalDocument = {
  blocks: [
    {
      kind: "p",
      text: 'Les présentes Conditions d\'utilisation (« Conditions ») régissent votre accès et votre utilisation de la plateforme {{name}}, du site web et des services associés (collectivement, le « Service »). En créant un compte ou en utilisant le Service, vous acceptez ces Conditions. Dans le cas contraire, n\'utilisez pas le Service.',
    },
    { kind: "h2", text: "1. À propos de {{name}}" },
    {
      kind: "p",
      text: "{{name}} est une place de marché en ligne qui met en relation des propriétaires de matériel (« Propriétaires ») et des personnes ou entreprises souhaitant louer du matériel (« Locataires ») en Tunisie. Nous facilitons la découverte, les demandes de réservation, les paiements et la communication, sans être partie au contrat de location entre Propriétaire et Locataire, sauf mention contraire.",
    },
    { kind: "h2", text: "2. Éligibilité et comptes" },
    {
      kind: "ul",
      items: [
        "Vous devez avoir au moins 18 ans et la capacité de conclure un contrat contraignant.",
        "Vous devez fournir des informations d'inscription exactes et sécuriser votre compte.",
        "Les Propriétaires peuvent devoir compléter une vérification d'identité (KYC) avant la publication des annonces.",
        "Nous pouvons suspendre ou résilier les comptes qui violent ces Conditions ou la loi applicable.",
      ],
    },
    { kind: "h2", text: "3. Annonces et réservations" },
    {
      kind: "p",
      text: "Les Propriétaires sont responsables de l'exactitude des annonces (photos, tarifs en dinars tunisiens, disponibilité, lieu, caution, état du matériel). Les Locataires envoient des demandes pour des dates précises ; les Propriétaires peuvent accepter ou refuser. Une réservation n'est confirmée que lorsque les deux parties terminent les étapes du parcours (y compris le paiement si requis).",
    },
    {
      kind: "ul",
      items: [
        "Les Locataires doivent utiliser le matériel de manière licite et le restituer dans l'état convenu.",
        "Les cautions peuvent être retenues puis libérées après inspection, selon les règles de litige.",
        "Des frais de plateforme s'appliquent comme indiqué au paiement et dans le détail des prix.",
      ],
    },
    { kind: "h2", text: "4. Paiements" },
    {
      kind: "p",
      text: "Les paiements sont traités par nos partenaires. Les prix sont affichés en TND sauf indication contraire. Vous nous autorisez, ainsi que nos prestataires de paiement, à débiter les montants des locations, frais et cautions selon le récapitulatif de réservation. Un échec ou litige de paiement peut entraîner une annulation ou des restrictions de compte.",
    },
    { kind: "h2", text: "5. Annulations, litiges et remboursements" },
    {
      kind: "p",
      text: "L'éligibilité à l'annulation et au remboursement dépend du statut de la réservation et du motif. Chaque partie peut ouvrir un litige via le Service (non-livraison, dommages, fausse description). Nous pouvons examiner les litiges et agir sur les comptes ou versements, sans garantir un résultat particulier. Rien dans ces Conditions ne limite vos droits légaux en matière de consommation en Tunisie, le cas échéant.",
    },
    { kind: "h2", text: "6. Avis et contenus" },
    {
      kind: "p",
      text: "Vous pouvez publier des avis et autres contenus. Vous accordez à {{name}} une licence non exclusive pour utiliser, afficher et modérer ces contenus sur le Service. Ne publiez pas de contenu faux, offensant ou contrefaisant. Nous pouvons supprimer du contenu à notre discrétion.",
    },
    { kind: "h2", text: "7. Comportements interdits" },
    { kind: "p", text: "Vous vous engagez à ne pas :" },
    {
      kind: "ul",
      items: [
        "Contourner la plateforme pour éviter les frais ou mesures de sécurité.",
        "Publier du matériel volé, dangereux ou illégal.",
        "Harceler d'autres utilisateurs ou détourner des données personnelles obtenues via le Service.",
        "Perturber, extraire ou rétro-ingénier le Service.",
      ],
    },
    { kind: "h2", text: "8. Responsabilité" },
    {
      kind: "p",
      text: "Le Service est fourni « en l'état » dans la mesure permise par la loi. {{name}} n'est pas responsable des dommages indirects liés aux locations entre utilisateurs. Notre responsabilité totale envers vous pour toute réclamation liée au Service est limitée aux frais que vous nous avez payés au cours des douze mois précédant la réclamation, sauf si la loi l'interdit.",
    },
    { kind: "h2", text: "9. Modifications" },
    {
      kind: "p",
      text: "Nous pouvons mettre à jour ces Conditions. La version révisée sera publiée sur le Service avec une date de « Dernière mise à jour ». L'utilisation continue vaut acceptation des Conditions révisées.",
    },
    { kind: "h2", text: "10. Contact" },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "Questions sur ces Conditions : utilisez notre " },
        { type: "link", to: "/contact", label: "formulaire de contact" },
        { type: "text", value: " ou les canaux d'assistance indiqués sur le site." },
      ],
    },
  ],
};

const ar: LegalDocument = {
  blocks: [
    {
      kind: "p",
      text: 'تحكم شروط الخدمة هذه ("الشروط") وصولك إلى منصة {{name}} والموقع والخدمات المرتبطة ("الخدمة") واستخدامها. بإنشاء حساب أو استخدام الخدمة، فإنك توافق على هذه الشروط. إذا لم توافق، لا تستخدم الخدمة.',
    },
    { kind: "h2", text: "1. حول {{name}}" },
    {
      kind: "p",
      text: '{{name}} سوق إلكتروني يربط مالكي المعدات ("المالكون") بمن يرغبون في استئجار معدات ("المستأجرون") في تونس. نسهّل الاكتشاف وطلبات الحجز والمدفوعات والتواصل، دون أن نكون طرفاً في عقد الإيجار بين المالك والمستأجر ما لم يُنص على خلاف ذلك.',
    },
    { kind: "h2", text: "2. الأهلية والحسابات" },
    {
      kind: "ul",
      items: [
        "يجب أن يكون عمرك 18 عاماً على الأقل وأن تكون قادراً على إبرام عقد ملزم.",
        "يجب تقديم معلومات تسجيل دقيقة والحفاظ على أمان حسابك.",
        "قد يُطلب من المالكين إكمال التحقق من الهوية (KYC) قبل نشر الإعلانات.",
        "يجوز لنا تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط أو القانون المعمول به.",
      ],
    },
    { kind: "h2", text: "3. الإعلانات والحجوزات" },
    {
      kind: "p",
      text: "المالكون مسؤولون عن دقة الإعلانات (الصور، الأسعار بالدينار التونسي، التوفر، الموقع، الضمان، حالة المعدات). يقدّم المستأجرون طلبات لتواريخ محددة؛ ويمكن للمالك القبول أو الرفض. يُؤكَّد الحجز فقط عند إكمال الطرفين خطوات سير العمل (بما في ذلك الدفع عند الحاجة).",
    },
    {
      kind: "ul",
      items: [
        "يجب على المستأجرين استخدام المعدات لأغراض مشروعة وإرجاعها بالحالة المتفق عليها.",
        "قد تُحجز الودائع وتُسترد بعد الفحص وفق قواعد النزاعات.",
        "تُطبَّق رسوم المنصة كما تظهر عند الدفع وفي تفاصيل السعر.",
      ],
    },
    { kind: "h2", text: "4. المدفوعات" },
    {
      kind: "p",
      text: "تُعالَج المدفوعات عبر شركائنا. الأسعار بالدينار التونسي ما لم يُذكر خلاف ذلك. أنت تفوضنا ومزودي الدفع بخصم مبالغ الإيجار والرسوم والودائع حسب ملخص الحجز. قد يؤدي فشل الدفع أو النزاع إلى الإلغاء أو تقييد الحساب.",
    },
    { kind: "h2", text: "5. الإلغاء والنزاعات والاسترداد" },
    {
      kind: "p",
      text: "يختلف حق الإلغاء والاسترداد حسب حالة الحجز والسبب. يمكن لأي طرف فتح نزاع عبر الخدمة (عدم التسليم، أضرار، وصف مضلل). قد نراجع النزاعات ونتخذ إجراءات على الحسابات أو التحويلات دون ضمان نتيجة معينة. لا تحد هذه الشروط حقوقك القانونية بموجب قانون حماية المستهلك التونسي عند انطباقه.",
    },
    { kind: "h2", text: "6. التقييمات والمحتوى" },
    {
      kind: "p",
      text: "يمكنك نشر تقييمات ومحتوى آخر. تمنح {{name}} ترخيصاً غير حصري لاستخدام هذا المحتوى وعرضه ومراجعته على الخدمة. لا تنشر مواداً كاذبة أو مسيئة أو منتهكة للحقوق. يجوز لنا إزالة المحتوى وفق تقديرنا.",
    },
    { kind: "h2", text: "7. السلوك المحظور" },
    { kind: "p", text: "توافق على عدم:" },
    {
      kind: "ul",
      items: [
        "التحايل على المنصة لتجنب الرسوم أو إجراءات السلامة.",
        "إدراج معدات مسروقة أو غير آمنة أو غير قانونية.",
        "مضايقة المستخدمين أو إساءة استخدام البيانات الشخصية المحصل عليها عبر الخدمة.",
        "محاولة تعطيل الخدمة أو استخراج البيانات أو هندستها عكسياً.",
      ],
    },
    { kind: "h2", text: "8. المسؤولية" },
    {
      kind: "p",
      text: 'تُقدَّم الخدمة "كما هي" في الحدود التي يسمح بها القانون. {{name}} غير مسؤول عن الأضرار غير المباشرة الناتجة عن الإيجارات بين المستخدمين. مسؤوليتنا الإجمالية تجاهك محدودة بالرسوم المدفوعة لنا خلال الاثني عشر شهراً السابقة للمطالبة، ما لم يمنع القانون ذلك.',
    },
    { kind: "h2", text: "9. التعديلات" },
    {
      kind: "p",
      text: 'يجوز لنا تحديث هذه الشروط. سننشر النسخة المعدّلة على الخدمة ونحدّث تاريخ "آخر تحديث". استمرار الاستخدام بعد التعديل يعني قبول الشروط المعدّلة.',
    },
    { kind: "h2", text: "10. التواصل" },
    {
      kind: "pRich",
      parts: [
        { type: "text", value: "أسئلة حول هذه الشروط: استخدم " },
        { type: "link", to: "/contact", label: "نموذج الاتصال" },
        { type: "text", value: " أو قنوات الدعم المذكورة على الموقع." },
      ],
    },
  ],
};

export const termsDocuments: Record<AppLanguage, LegalDocument> = { en, fr, ar };
