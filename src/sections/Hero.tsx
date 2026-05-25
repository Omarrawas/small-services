import { useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { value: "12,000+", label: "خدمة" },
  { value: "5,000+", label: "بائع" },
  { value: "25,000+", label: "طلب منجز" },
  { value: "4.8", label: "متوسط التقييم" },
];

export default function Hero() {
  const [search, setSearch] = useState("");

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D5D48 0%, #094533 50%, #0D5D48 100%)" }}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 geometric-pattern opacity-100" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20">
        <p className="text-[#C49A2C] text-sm font-medium tracking-widest mb-4 animate-fade-in-up">
          منصة الخدمات الرقمية الأولى في سوريا
        </p>

        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up stagger-1">
          أنجز مشاريعك{" "}
          <span className="text-[#C49A2C]">بسهولة</span>{" "}
          واحترافية
        </h1>

        <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto animate-fade-in-up stagger-2">
          اكتشف آلاف الخدمات الرقمية من أفضل البائعين — تصميم، برمجة، ترجمة، تسويق، وغيرها
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10 animate-fade-in-up stagger-3">
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-2 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ما الخدمة التي تبحث عنها؟"
              className="border-0 shadow-none focus-visible:ring-0 text-right text-[#1A1A2E] placeholder:text-gray-400 bg-transparent flex-1 h-12"
            />
            <Button
              className="bg-[#0D5D48] hover:bg-[#094533] text-white rounded-xl px-6 h-12 font-semibold shrink-0"
              asChild
            >
              <Link to={`/services?q=${search}`}>بحث</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-8 animate-fade-in-up stagger-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[#C49A2C] text-2xl sm:text-3xl font-bold">{stat.value}</div>
              <div className="text-white/70 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up stagger-5">
          <Button
            asChild
            className="bg-white text-[#0D5D48] hover:bg-gray-100 rounded-xl px-8 py-3 text-base font-semibold h-auto"
          >
            <Link to="/services">تصفح الخدمات</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10 rounded-xl px-8 py-3 text-base font-semibold h-auto"
          >
            <Link to="/register">انضم كبائع</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
