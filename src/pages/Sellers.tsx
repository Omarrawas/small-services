import { useState, useMemo } from "react";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router";
import { sellers } from "@/lib/mockData";

export default function Sellers() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = useMemo(() => {
    let result = [...sellers];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.bio.toLowerCase().includes(q));
    }
    if (sortBy === "rating") result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    if (sortBy === "orders") result.sort((a, b) => b.totalOrders - a.totalOrders);
    return result;
  }, [query, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />

      <div className="bg-[#E8F5F0] py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-[#1A1A2E] text-3xl font-bold mb-2">أفضل البائعين</h1>
          <p className="text-gray-500 text-base">تصفح وتواصل مع أفضل البائعين في مختلف المجالات</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن بائع..." className="pr-10" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 px-3 rounded-lg border border-[#E5E5DF] bg-white text-sm text-[#1A1A2E]">
            <option value="rating">الأعلى تقييماً</option>
            <option value="orders">الأكثر طلباً</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((seller, i) => {
            const rtHours = Math.floor((seller.responseTime || 60) / 60);
            const rtLabel = rtHours > 0 ? `< ${rtHours + 1} ساعة` : `< ${seller.responseTime} دقيقة`;
            return (
              <div
                key={seller.id}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              >
                <div className="flex items-start gap-4">
                  <img src={seller.avatar} alt={seller.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#E8F5F0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1A1A2E] text-lg">{seller.name}</h3>
                    <span className="text-xs bg-[#FDF6E3] text-[#C49A2C] px-2 py-0.5 rounded-full">{seller.levelLabel}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{seller.rating}</span>
                      <span className="text-sm text-gray-500">({seller.totalOrders} طلب)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-3 line-clamp-2">{seller.bio}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>استجابة: {rtLabel}</span>
                </div>
                <Button variant="outline" className="w-full mt-4 border-[#0D5D48] text-[#0D5D48] hover:bg-[#E8F5F0] rounded-xl" asChild>
                  <Link to={`/sellers/${seller.id}`}>عرض الملف</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
