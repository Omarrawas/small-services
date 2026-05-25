import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Hexagon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الخدمات", href: "/services" },
  { label: "البائعون", href: "/sellers" },
  { label: "لوحة التحكم", href: "/dashboard" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            : "bg-white/95 backdrop-blur-md border-b border-[#E5E5DF]"
        }`}
        style={{ height: 72 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Hexagon className="w-8 h-8 text-[#0D5D48] fill-[#0D5D48]" />
            <span
              className="text-[#0D5D48] text-2xl font-medium"
              style={{ fontFamily: "'Reem Kufi', 'Cairo', sans-serif" }}
            >
              خدماتي
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-[15px] font-medium transition-colors hover:text-[#0D5D48] ${
                  location.pathname === link.href ? "text-[#0D5D48]" : "text-[#1A1A2E]"
                }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute -bottom-1 right-0 w-full h-0.5 bg-[#0D5D48] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-[15px] font-medium text-[#1A1A2E] hover:text-[#0D5D48] transition-colors"
                >
                  <img
                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[15px] font-medium text-[#0D5D48] hover:text-[#094533] transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Button
                  asChild
                  className="bg-[#0D5D48] hover:bg-[#094533] text-white rounded-xl px-5 py-2 text-[15px] font-semibold shadow-[0_4px_12px_rgba(13,93,72,0.25)]"
                >
                  <Link to="/register">انضم كبائع</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#1A1A2E]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-[72px] right-0 w-80 max-w-full h-[calc(100vh-72px)] bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-lg font-medium py-2 px-4 rounded-xl transition-colors ${
                    location.pathname === link.href
                      ? "bg-[#E8F5F0] text-[#0D5D48]"
                      : "text-[#1A1A2E] hover:bg-[#F5F5F0]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-[#E5E5DF]" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[#1A1A2E]">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 text-red-500 font-medium py-2 px-4 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-lg font-medium text-[#0D5D48] py-2 px-4">
                    تسجيل الدخول
                  </Link>
                  <Link to="/register">
                    <Button className="w-full bg-[#0D5D48] hover:bg-[#094533] text-white rounded-xl py-3 text-[15px] font-semibold">
                      انضم كبائع
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
