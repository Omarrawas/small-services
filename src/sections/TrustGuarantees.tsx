import { Shield, Clock, Award } from "lucide-react";

const guarantees = [
  {
    icon: Shield,
    title: "ضمان مالي كامل",
    description: "أموالك محمية في حساب الضمان حتى استلام الخدمة بالشكل المطلوب",
  },
  {
    icon: Clock,
    title: "توصيل في الوقت المحدد",
    description: "نضمن لك استلام الخدمة في الموعد المتفق عليه أو استعادة أموالك",
  },
  {
    icon: Award,
    title: "جودة مضمونة",
    description: "نقوم بمراجعة جميع الخدمات قبل نشرها لضمان أعلى معايير الجودة",
  },
];

export default function TrustGuarantees() {
  return (
    <section className="py-20 bg-[#1A1A2E]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-white text-3xl font-bold mb-2">لماذا تختار خدماتي</h2>
          <p className="text-white/60 text-base">نضمن لك تجربة آمنة وموثوقة على منصتنا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {guarantees.map((item, i) => (
            <div
              key={i}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
            >
              <div className="w-14 h-14 rounded-full bg-[#C49A2C]/20 flex items-center justify-center mx-auto mb-5">
                <item.icon className="w-7 h-7 text-[#C49A2C]" />
              </div>
              <h4 className="text-white font-semibold text-xl mb-3">{item.title}</h4>
              <p className="text-white/70 text-sm leading-relaxed max-w-[320px] mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
