import { Link } from "react-router";
import { Hexagon, Mail, Phone, MapPin, Facebook, Send, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "تصفح الخدمات", href: "/services" },
  { label: "البائعون", href: "/sellers" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "سياسة الخصوصية", href: "/privacy" },
];

const categoryLinks = [
  { label: "تصميم", href: "/services?category=design" },
  { label: "برمجة", href: "/services?category=programming" },
  { label: "ترجمة", href: "/services?category=translation" },
  { label: "تسويق", href: "/services?category=marketing" },
  { label: "فيديو وصوت", href: "/services?category=video" },
];

export default function Footer() {
  return (
    <footer className="bg-[#16213E] text-white">
      <div className="max-w-[1200px] mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Hexagon className="w-8 h-8 text-[#C49A2C] fill-[#0D5D48]" />
              <span
                className="text-white text-2xl font-medium"
                style={{ fontFamily: "'Reem Kufi', 'Cairo', sans-serif" }}
              >
                خدماتي
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة الخدمات الرقمية الأولى في سوريا. نربطك بأفضل البائعين لتنفيذ مشاريعك بسهولة واحترافية.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0D5D48] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0D5D48] transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0D5D48] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">روابط سريعة</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">التصنيفات</h4>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">تواصل معنا</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C49A2C]" />
                support@khadamati.sy
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A2C]" />
                +963 987 654 321
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C49A2C]" />
                دمشق، سوريا
              </li>
            </ul>
            <div className="mt-5">
              <div className="flex gap-2">
                <Input
                  placeholder="بريدك الإلكتروني"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm h-10 rounded-lg"
                />
                <Button className="bg-[#0D5D48] hover:bg-[#094533] h-10 px-4 rounded-lg shrink-0">
                  اشترك
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 خدماتي. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
