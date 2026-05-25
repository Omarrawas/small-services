import { Link } from "react-router";
import { Palette, Code2, Languages, TrendingUp, Video, Briefcase, GraduationCap, Headphones } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Palette, Code2, Languages, TrendingUp, Video, Briefcase, GraduationCap, Headphones,
};

interface CategoryCardProps {
  nameAr: string;
  slug: string;
  icon: string;
  serviceCount: number;
}

export default function CategoryCard({ nameAr, slug, icon, serviceCount }: CategoryCardProps) {
  const IconComponent = iconMap[icon] || Palette;

  return (
    <Link to={`/services?category=${slug}`} className="group block">
      <div className="bg-white rounded-2xl p-7 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] card-hover transition-all duration-300">
        <div className="w-14 h-14 rounded-full bg-[#E8F5F0] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0D5D48] transition-all duration-300 group-hover:scale-110">
          <IconComponent className="w-6 h-6 text-[#0D5D48] group-hover:text-white transition-colors" />
        </div>
        <h4 className="text-[#1A1A2E] font-semibold text-lg mb-1">{nameAr}</h4>
        <p className="text-gray-500 text-sm">
          {serviceCount.toLocaleString()} خدمة
        </p>
      </div>
    </Link>
  );
}
