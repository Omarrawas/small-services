import { Search, Users, ShieldCheck, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: 1,
    title: "ابحث عن خدمة",
    description: "تصفح آلاف الخدمات في مختلف التصنيفات واختر ما يناسبك",
  },
  {
    icon: Users,
    number: 2,
    title: "اختر البائع",
    description: "قارن الأسعار والتقييمات واختر الأنسب لمشروعك",
  },
  {
    icon: ShieldCheck,
    number: 3,
    title: "اطلب الخدمة",
    description: "حدد متطلباتك وادفع عبر الضمان المالي لحمايتك",
  },
  {
    icon: Star,
    number: 4,
    title: "استلم العمل",
    description: "استلم عملك بجودة عالية وقيّم البائع لتجربة أفضل",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#E8F5F0]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-[#1A1A2E] text-3xl font-bold mb-2">كيف تعمل المنصة</h2>
          <p className="text-gray-500 text-base">أربع خطوات بسيطة لتنفيذ مشروعك</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-0 w-full h-0 border-t-2 border-dashed border-[#0D5D48]/30 transform translate-x-1/2" />
              )}

              <div className="relative z-10 w-12 h-12 rounded-full bg-[#0D5D48] text-white flex items-center justify-center mx-auto mb-5 text-xl font-bold shadow-lg">
                {step.number}
              </div>
              <div className="w-14 h-14 rounded-full bg-[#0D5D48]/10 flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-[#0D5D48]" />
              </div>
              <h4 className="text-[#1A1A2E] font-semibold text-lg mb-2">{step.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[240px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
