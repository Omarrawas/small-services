import { Link } from "react-router";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SellerCardProps {
  id: number;
  name: string;
  avatar: string;
  levelLabel: string;
  rating: string;
  totalOrders: number;
  responseTime: number;
}

export default function SellerCard({
  id, name, avatar, levelLabel, rating, totalOrders, responseTime,
}: SellerCardProps) {
  const rtHours = Math.floor(responseTime / 60);
  const rtMins = responseTime % 60;
  const rtLabel = rtHours > 0 ? `< ${rtHours + 1} ساعة` : `< ${rtMins} دقيقة`;

  return (
    <div className="bg-white rounded-2xl p-7 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] card-hover transition-all duration-300">
      <div className="relative mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full object-cover mx-auto border-[3px] border-[#E8F5F0]"
        />
      </div>
      <h4 className="text-[#1A1A2E] font-semibold text-lg mb-1">{name}</h4>
      <span className="inline-block text-xs bg-[#FDF6E3] text-[#C49A2C] px-3 py-1 rounded-full mb-3">
        {levelLabel}
      </span>
      <div className="flex items-center justify-center gap-1 mb-4">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
      <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-5">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-[#1A1A2E]">{totalOrders}</span>
          <span className="text-xs">طلب</span>
        </div>
        <div className="w-px h-8 bg-[#E5E5DF]" />
        <div className="flex flex-col items-center">
          <span className="font-semibold text-[#1A1A2E]">{rating}</span>
          <span className="text-xs">تقييم</span>
        </div>
        <div className="w-px h-8 bg-[#E5E5DF]" />
        <div className="flex flex-col items-center">
          <span className="font-semibold text-[#1A1A2E]">{rtLabel}</span>
          <span className="text-xs">استجابة</span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full border-[#0D5D48] text-[#0D5D48] hover:bg-[#0D5D48] hover:text-white rounded-xl transition-all"
        asChild
      >
        <Link to={`/sellers/${id}`}>عرض الملف</Link>
      </Button>
    </div>
  );
}
