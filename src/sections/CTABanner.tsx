import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function CTABanner() {
  return (
    <section
      className="py-16 animate-fade-in-up"
      style={{ background: "linear-gradient(135deg, #0D5D48 0%, #094533 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        <h2 className="text-white text-3xl font-bold mb-3">ابدأ الآن وانضم لمجتمع خدماتي</h2>
        <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
          سواء كنت تبحث عن خدمة أو تريد عرض خدماتك — نحن هنا لنساعدك
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
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
            <Link to="/register">سجّل كبائع</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
