// Categories
export const categories = [
  { id: 1, nameAr: "تصميم", slug: "design", icon: "Palette", serviceCount: 1240, description: "شعارات، هويات بصرية، تصاميم سوشيال ميديا" },
  { id: 2, nameAr: "برمجة وتطوير", slug: "programming", icon: "Code2", serviceCount: 980, description: "مواقع إلكترونية، تطبيقات، برمجة خاصة" },
  { id: 3, nameAr: "ترجمة وكتابة", slug: "translation", icon: "Languages", serviceCount: 750, description: "ترجمة، كتابة محتوى، تدقيق لغوي" },
  { id: 4, nameAr: "تسويق رقمي", slug: "marketing", icon: "TrendingUp", serviceCount: 620, description: "إعلانات، SEO، تسويق سوشيال ميديا" },
  { id: 5, nameAr: "فيديو وصوت", slug: "video", icon: "Video", serviceCount: 540, description: "مونتاج، موشن جرافيك، تصوير" },
  { id: 6, nameAr: "أعمال وإدارة", slug: "business", icon: "Briefcase", serviceCount: 430, description: "استشارات، إدارة مشاريع، سكرتارية" },
  { id: 7, nameAr: "تعليم وتدريب", slug: "education", icon: "GraduationCap", serviceCount: 380, description: "دروس، تدريب، تحضير اختبارات" },
  { id: 8, nameAr: "دعم فني", slug: "support", icon: "Headphones", serviceCount: 290, description: "صيانة، استضافة، حماية" },
];

// Sellers
export const sellers = [
  { id: 1, name: "سارة م.", avatar: "/images/seller-1.jpg", level: "top_rated", levelLabel: "بائع مميز", rating: "5.0", totalOrders: 203, completedOrders: 198, responseTime: 45, bio: "مترجمة وكاتبة محتوى متخصصة بخبرة 5 سنوات في الترجمة العربية-الإنجليزية والكتابة الإبداعية والتسويقية" },
  { id: 2, name: "أحمد س.", avatar: "/images/seller-2.jpg", level: "top_rated", levelLabel: "بائع مميز", rating: "4.9", totalOrders: 127, completedOrders: 123, responseTime: 90, bio: "مصمم جرافيك متخصص في تصميم الشعارات والهويات البصرية بخبرة 7 سنوات في العمل مع الشركات الناشئة" },
  { id: 3, name: "محمد خ.", avatar: "/images/seller-3.jpg", level: "level2", levelLabel: "بائع نشيط", rating: "4.8", totalOrders: 89, completedOrders: 85, responseTime: 150, bio: "مطور ويب متخصص في Next.js وReact مع خبرة في بناء تطبيقات الويب الكاملة والمتاجر الإلكترونية" },
  { id: 4, name: "ندى ف.", avatar: "/images/seller-4.jpg", level: "top_rated", levelLabel: "بائع مميز", rating: "4.9", totalOrders: 167, completedOrders: 161, responseTime: 30, bio: "كاتبة محتوى متخصصة في SEO والتسويق الرقمي، أساعد العلامات التجارية في بناء محتوى يجذب الجمهور" },
];

// Services
export const services = [
  {
    id: 1, sellerId: 2, categoryId: 1,
    title: "تصميم شعار احترافي لهويتك التجارية",
    slug: "logo-design-professional",
    description: "سأقوم بتصميم شعار احترافي ومميز لهويتك التجارية. يشمل العمل: 3 مقترحات مختلفة، تعديلات غير محدودة حتى الرضا الكامل، ملفات المصدر بجميع الصيغ (AI, EPS, PNG, JPG, PDF). الشعار سيكون فريداً ومبتكراً يعكس قيم علامتك التجارية ويجذب عملاءك المستهدفين. الخدمة تشمل أيضاً دليل استخدام الشعار للحفاظ على الهوية البصرية.",
    price: "25000.00", deliveryTime: 3,
    images: ["/images/service-1.jpg"],
    extras: [{ name: "تصميم بطاقة أعمال", price: 15000, deliveryTime: 1 }, { name: "تصميم غلاف سوشيال ميديا", price: 10000, deliveryTime: 1 }],
    tags: ["شعار", "هوية بصرية", "تصميم"],
    status: "active", rating: "4.9", totalReviews: 127, totalOrders: 145, featured: true,
  },
  {
    id: 2, sellerId: 3, categoryId: 2,
    title: "تطوير موقع إلكتروني متكامل بـ Next.js",
    slug: "nextjs-website-development",
    description: "تطوير موقع إلكتروني احترافي باستخدام Next.js مع React وTypeScript. الموقع سيكون سريعاً، متجاوباً مع جميع الأجهزة، ومحسّناً لمحركات البحث. يشمل: تصميم مخصص، لوحة تحكم، ربط بقاعدة البيانات، نظام مصادقة، ونشر على الاستضافة.",
    price: "150000.00", deliveryTime: 14,
    images: ["/images/service-2.jpg"],
    extras: [{ name: "لوحة تحكم أدمن متقدمة", price: 50000, deliveryTime: 3 }, { name: "دعم فني شهرين", price: 30000, deliveryTime: 0 }],
    tags: ["Next.js", "React", "تطوير ويب"],
    status: "active", rating: "4.8", totalReviews: 89, totalOrders: 98, featured: true,
  },
  {
    id: 3, sellerId: 1, categoryId: 3,
    title: "ترجمة احترافية عربي-إنجليزي 1000 كلمة",
    slug: "professional-translation-1000",
    description: "ترجمة دقيقة واحترافية بين العربية والإنجليزية لـ 1000 كلمة. أضمن: دقة في المعنى، أسلوب سلس، مراعاة السياق الثقافي، تدقيق لغوي شامل، وتسليم في الموعد. متخصصة في المستندات القانونية، التقنية، الطبية، والتجارية.",
    price: "15000.00", deliveryTime: 2,
    images: ["/images/service-3.jpg"],
    extras: [{ name: "تدقيق لغوي إضافي", price: 5000, deliveryTime: 1 }, { name: "تنسيق احترافي", price: 3000, deliveryTime: 0 }],
    tags: ["ترجمة", "عربي", "إنجليزي"],
    status: "active", rating: "5.0", totalReviews: 203, totalOrders: 215, featured: true,
  },
  {
    id: 4, sellerId: 3, categoryId: 4,
    title: "إدارة حملات إعلانية على فيسبوك",
    slug: "facebook-ads-campaign",
    description: "إدارة حملاتك الإعلانية على فيسبوك وإنستغرام بشكل احترافي. يشمل: تحليل الجمهور المستهدف، تصميم الإعلانات، كتابة نصوص جذابة، إعداد الحملات، متابعة يومية، تقارير أسبوعية مفصلة. هدفي تحقيق أعلى عائد على الاستثمار لإعلاناتك.",
    price: "35000.00", deliveryTime: 7,
    images: ["/images/service-4.jpg"],
    extras: [{ name: "تصميم 5 بنرات إعلانية", price: 15000, deliveryTime: 2 }, { name: "تحليل منافسين", price: 10000, deliveryTime: 1 }],
    tags: ["فيسبوك", "إعلانات", "تسويق"],
    status: "active", rating: "4.7", totalReviews: 56, totalOrders: 62, featured: true,
  },
  {
    id: 5, sellerId: 2, categoryId: 5,
    title: "مونتاج فيديو احترافي حتى 10 دقائق",
    slug: "video-editing-10min",
    description: "مونتاج فيديو احترافي باستخدام Adobe Premiere Pro وAfter Effects. يشمل: قص وتجميع المشاهد، إضافة موسيقى ومؤثرات صوتية، ترجمة وكتابة على الشاشة، تلوين وتصحيح الألوان، مؤثرات بصرية. مثالي للمحتوى على يوتيوب وسوشيال ميديا.",
    price: "20000.00", deliveryTime: 5,
    images: ["/images/service-5.jpg"],
    extras: [{ name: "موشن جرافيك مقدمة", price: 25000, deliveryTime: 2 }, { name: "ترجمة أنجليزية", price: 10000, deliveryTime: 1 }],
    tags: ["مونتاج", "فيديو", "موشن جرافيك"],
    status: "active", rating: "4.9", totalReviews: 78, totalOrders: 85, featured: true,
  },
  {
    id: 6, sellerId: 1, categoryId: 1,
    title: "تصميم بوستات سوشيال ميديا 10 تصاميم",
    slug: "social-media-posts-10",
    description: "تصميم 10 بوستات احترافية لمنصاتك على السوشيال ميديا (إنستغرام، فيسبوك، تويتر). يشمل: تصاميم متناسقة مع هويتك البصرية، نصوص عربية جميلة، أيقونات ورسوم توضيحية، جاهزة للنشر مباشرة.",
    price: "12000.00", deliveryTime: 3,
    images: ["/images/service-6.jpg"],
    extras: [{ name: "قالب قصص 5 تصاميم", price: 8000, deliveryTime: 1 }, { name: "تقويم محتوى شهري", price: 5000, deliveryTime: 0 }],
    tags: ["سوشيال ميديا", "تصميم", "بوستات"],
    status: "active", rating: "4.8", totalReviews: 134, totalOrders: 142, featured: true,
  },
  {
    id: 7, sellerId: 4, categoryId: 4,
    title: "كتابة محتوى SEO لمدونتك",
    slug: "seo-content-writing",
    description: "كتابة مقالات محسّنة لمحركات البحث (SEO) لمدونتك أو موقعك. يشمل: بحث الكلمات المفتاحية، كتابة عنوان جذاب، محتوى أصلي 100% خالٍ من الانتحال، تنظيم المقال بالعناوين الفرعية، توصيات لتحسين الترتيب. كل مقال 1500-2000 كلمة.",
    price: "18000.00", deliveryTime: 3,
    images: ["/images/service-7.jpg"],
    extras: [{ name: "صورة مصاحبة للمقال", price: 5000, deliveryTime: 1 }, { name: "نشر على الموقع", price: 3000, deliveryTime: 0 }],
    tags: ["SEO", "كتابة", "محتوى"],
    status: "active", rating: "4.9", totalReviews: 167, totalOrders: 178, featured: true,
  },
  {
    id: 8, sellerId: 3, categoryId: 2,
    title: "تطوير تطبيق موبايل Flutter",
    slug: "flutter-mobile-app",
    description: "تطوير تطبيق موبايل احترافي باستخدام Flutter يعمل على Android وiOS. يشمل: واجهة مستخدم جميلة، ربط بالـ Backend، مصادقة المستخدمين، إشعارات، نشر على المتاجر. التطبيق سيكون سريعاً وسلساً مع تجربة مستخدم ممتازة.",
    price: "200000.00", deliveryTime: 21,
    images: ["/images/service-8.jpg"],
    extras: [{ name: "واجهة أدمن للتطبيق", price: 75000, deliveryTime: 5 }, { name: "دعم فني 3 أشهر", price: 50000, deliveryTime: 0 }],
    tags: ["Flutter", "موبايل", "تطبيق"],
    status: "active", rating: "4.8", totalReviews: 45, totalOrders: 52, featured: true,
  },
];

// Reviews
export const reviews = [
  { id: 1, orderId: 1, reviewerName: "خالد ع.", reviewerAvatar: "/images/seller-3.jpg", revieweeId: 2, type: "buyer_to_seller", rating: 5, comment: "عمل رائع وممتاز! الشعار تجاوز توقعاتي بكثير. التعامل كان احترافياً والتسليم في الموعد. أنصح بالتعامل معه بشدة.", serviceTitle: "تصميم شعار احترافي", createdAt: "2025-12-15" },
  { id: 2, orderId: 2, reviewerName: "فاطمة ر.", reviewerAvatar: "/images/seller-1.jpg", revieweeId: 2, type: "buyer_to_seller", rating: 5, comment: "تعامل ممتاز وجودة عالية جداً. أحمد فهم احتياجاتي من أول مرة والتصميم كان بالضبط ما أردت. سأتعامل معه مرة أخرى بالتأكيد.", serviceTitle: "تصميم شعار احترافي", createdAt: "2025-11-28" },
  { id: 3, orderId: 3, reviewerName: "عمر س.", reviewerAvatar: "/images/seller-2.jpg", revieweeId: 1, type: "buyer_to_seller", rating: 5, comment: "ترجمة دقيقة جداً وأسلوب سلس. سارة محترفة حقاً في عملها وأسلوبها لطيف جداً. شكراً جزيلاً على التعاون.", serviceTitle: "ترجمة احترافية", createdAt: "2025-12-01" },
  { id: 4, orderId: 4, reviewerName: "ليلى م.", reviewerAvatar: "/images/seller-4.jpg", revieweeId: 3, type: "buyer_to_seller", rating: 4, comment: "موقع ممتاز وعمل احترافي. التسليم كان متأخر يوم واحد لكن الجودة عوضت عن ذلك. شكراً محمد على الصبر والتعاون.", serviceTitle: "تطوير موقع Next.js", createdAt: "2025-10-20" },
  { id: 5, orderId: 5, reviewerName: "رامي خ.", reviewerAvatar: "/images/seller-2.jpg", revieweeId: 4, type: "buyer_to_seller", rating: 5, comment: "مقالات رائعة ومؤثرة! ندى تكتب بأسلوب جذاب ومقالاتها تجلب زواراً حقيقيين للموقع. أنصح بها بشدة لمحتوى SEO.", serviceTitle: "كتابة محتوى SEO", createdAt: "2025-12-10" },
  { id: 6, orderId: 6, reviewerName: "سناء ع.", reviewerAvatar: "/images/seller-1.jpg", revieweeId: 3, type: "buyer_to_seller", rating: 5, comment: "حملات إعلانية ناجحة جداً! المبيعات زادت 40% خلال أسبوعين فقط. محمد يعرف تماماً ما يفعله في عالم الإعلانات.", serviceTitle: "إدارة حملات فيسبوك", createdAt: "2025-11-15" },
];

// Orders
export const orders = [
  { id: 1, orderNumber: "ORD-2025-001", buyerName: "خالد ع.", sellerName: "أحمد س.", serviceTitle: "تصميم شعار احترافي", totalAmount: "25000.00", status: "completed", createdAt: "2025-12-01", deliveryDate: "2025-12-04" },
  { id: 2, orderNumber: "ORD-2025-002", buyerName: "فاطمة ر.", sellerName: "سارة م.", serviceTitle: "ترجمة احترافية", totalAmount: "15000.00", status: "in_progress", createdAt: "2025-12-10", deliveryDate: "2025-12-12" },
  { id: 3, orderNumber: "ORD-2025-003", buyerName: "عمر س.", sellerName: "محمد خ.", serviceTitle: "تطوير موقع إلكتروني", totalAmount: "150000.00", status: "pending", createdAt: "2025-12-15", deliveryDate: "2025-12-29" },
  { id: 4, orderNumber: "ORD-2025-004", buyerName: "ليلى م.", sellerName: "ندى ف.", serviceTitle: "كتابة محتوى SEO", totalAmount: "18000.00", status: "delivered", createdAt: "2025-12-08", deliveryDate: "2025-12-11" },
  { id: 5, orderNumber: "ORD-2025-005", buyerName: "رامي خ.", sellerName: "أحمد س.", serviceTitle: "تصميم بوستات سوشيال", totalAmount: "12000.00", status: "completed", createdAt: "2025-11-20", deliveryDate: "2025-11-23" },
];

// Wallet transactions
export const walletTransactions = [
  { id: 1, type: "deposit", amount: "50000.00", balanceAfter: "50000.00", description: "إيداع عبر Sham Cash", status: "completed", createdAt: "2025-11-01" },
  { id: 2, type: "payment", amount: "-25000.00", balanceAfter: "25000.00", description: "دفع طلب #ORD-2025-001", status: "completed", createdAt: "2025-12-01" },
  { id: 3, type: "deposit", amount: "100000.00", balanceAfter: "125000.00", description: "إيداع عبر Syriatel Cash", status: "completed", createdAt: "2025-12-05" },
  { id: 4, type: "payment", amount: "-15000.00", balanceAfter: "110000.00", description: "دفع طلب #ORD-2025-002", status: "completed", createdAt: "2025-12-10" },
  { id: 5, type: "payment", amount: "-150000.00", balanceAfter: "-40000.00", description: "دفع طلب #ORD-2025-003", status: "pending", createdAt: "2025-12-15" },
];

// Notifications
export const notifications = [
  { id: 1, type: "order", title: "طلب جديد", body: "تم استلام طلبك بنجاح #ORD-2025-003", isRead: false, createdAt: "2025-12-15" },
  { id: 2, type: "message", title: "رسالة جديدة", body: "رسالة جديدة من محمد خ. بخصوص طلبك", isRead: false, createdAt: "2025-12-14" },
  { id: 3, type: "payment", title: "تم تأكيد الإيداع", body: "تم تأكيد إيداعك بمبلغ 100,000 ل.س", isRead: true, createdAt: "2025-12-05" },
  { id: 4, type: "review", title: "تقييم جديد", body: "قام خالد ع. بتقييمك: 5 نجوم", isRead: true, createdAt: "2025-12-02" },
  { id: 5, type: "order", title: "تم تسليم الطلب", body: "تم تسليم طلبك #ORD-2025-004، راجع العمل الآن", isRead: false, createdAt: "2025-12-11" },
];

// Conversations
export const conversations = [
  { id: 1, orderId: 3, buyerName: "عمر س.", sellerName: "محمد خ.", otherAvatar: "/images/seller-3.jpg", lastMessage: "شكراً، سأبدأ بالعمل فوراً وأرسل لك التصميم الأولي خلال يومين", lastMessageAt: "2025-12-15 14:30", unreadCount: 2 },
  { id: 2, orderId: 2, buyerName: "فاطمة ر.", sellerName: "سارة م.", otherAvatar: "/images/seller-1.jpg", lastMessage: "تم إرسال الملف المترجم، أرجو مراجعته والتأكد من رضاك", lastMessageAt: "2025-12-14 09:15", unreadCount: 0 },
  { id: 3, orderId: 4, buyerName: "ليلى م.", sellerName: "ندى ف.", otherAvatar: "/images/seller-4.jpg", lastMessage: "المقال الأول جاهز! هل يمكنك إرسال موضوع المقال الثاني؟", lastMessageAt: "2025-12-13 16:45", unreadCount: 1 },
];

// Admin stats
export const adminStats = [
  { label: "المستخدمون", value: 5420, trend: 12, icon: "Users" },
  { label: "الخدمات", value: 12340, trend: 8, icon: "Package" },
  { label: "الطلبات", value: 25100, trend: 15, icon: "ShoppingCart" },
  { label: "رصيد المحافظ", value: 45000000, trend: 0, icon: "Wallet", isCurrency: true },
  { label: "النزاعات", value: 3, trend: -2, icon: "AlertTriangle" },
  { label: "معدل الإنجاز", value: 94, trend: 2, icon: "CheckCircle", isPercent: true },
];

// Status labels in Arabic
export const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  delivered: "تم التسليم",
  revision: "يحتاج مراجعة",
  completed: "مكتمل",
  cancelled: "ملغي",
  disputed: "نزاع",
  active: "نشط",
  draft: "مسودة",
  paused: "متوقف",
  rejected: "مرفوض",
};

export const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700" },
  in_progress: { bg: "bg-blue-50", text: "text-blue-700" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700" },
  revision: { bg: "bg-purple-50", text: "text-purple-700" },
  completed: { bg: "bg-green-50", text: "text-green-700" },
  cancelled: { bg: "bg-red-50", text: "text-red-700" },
  disputed: { bg: "bg-orange-50", text: "text-orange-700" },
  active: { bg: "bg-green-50", text: "text-green-700" },
  draft: { bg: "bg-gray-50", text: "text-gray-700" },
  paused: { bg: "bg-yellow-50", text: "text-yellow-700" },
  rejected: { bg: "bg-red-50", text: "text-red-700" },
};

// Transaction type labels
export const transactionTypeLabels: Record<string, string> = {
  deposit: "إيداع",
  withdrawal: "سحب",
  payment: "دفع",
  refund: "استرداد",
  escrow_release: "إطلاق ضمان",
  fee: "رسوم",
};

// Transaction type colors
export const transactionTypeColors: Record<string, string> = {
  deposit: "text-green-600",
  withdrawal: "text-red-600",
  payment: "text-blue-600",
  refund: "text-amber-600",
  escrow_release: "text-emerald-600",
  fee: "text-gray-600",
};
