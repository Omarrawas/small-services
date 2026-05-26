import { useState } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, ShoppingBag, Wallet, MessageCircle, Bell, User, Settings,
  ChevronLeft, Star, ArrowUpRight, Eye, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/layout/Header";
import { statusLabels, statusColors, transactionTypeLabels, transactionTypeColors } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

import { useChat } from "@/hooks/useChat";

const sidebarItems = [

  { icon: LayoutDashboard, label: "لوحة التحكم", value: "dashboard" },
  { icon: ShoppingBag, label: "طلباتي", value: "orders" },
  { icon: Wallet, label: "محفظتي", value: "wallet" },
  { icon: MessageCircle, label: "محادثاتي", value: "chat" },
  { icon: Bell, label: "الإشعارات", value: "notifications" },
  { icon: User, label: "الملف الشخصي", value: "profile" },
  { icon: Settings, label: "الإعدادات", value: "settings" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth({ redirectOnUnauthenticated: true });

  // Data fetching
  const { data: walletData } = trpc.wallet.balance.useQuery(undefined, { enabled: !!user });
  const { data: ordersData } = trpc.orders.list.useQuery({ role: "buyer" }, { enabled: !!user });
  const { data: transactionsData } = trpc.wallet.transactions.useQuery({ limit: 10 }, { enabled: !!user });
  const { conversations, loading: chatLoading } = useChat();
  const balance = parseFloat(walletData?.balance ?? "0");
  const orders = ordersData ?? [];
  const activeOrders = orders.filter((o) => o.status === "in_progress" || o.status === "pending" || o.status === "revision");
  const walletTransactions = transactionsData ?? [];


  const stats = [
    { label: "رصيد المحفظة", value: `${balance.toLocaleString()} ل.س`, trend: 0, icon: Wallet, color: "bg-[#E8F5F0] text-[#0D5D48]" },
    { label: "طلباتي", value: orders.length.toString(), sub: `${activeOrders.length} نشط`, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "محادثات", value: conversations.length.toString(), sub: "متاح الآن", icon: MessageCircle, color: "bg-purple-50 text-purple-600" },
    { label: "إشعارات", value: "0", sub: "قريباً", icon: Bell, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />
      <div className="pt-[72px] flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white border-l border-[#E5E5DF] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-[#E8F5F0]"
              />
              <div>
                <p className="font-semibold text-[#1A1A2E] truncate w-32">{user?.name || "مستكشف"}</p>
                <Badge variant="secondary" className="text-[10px] py-0">{user?.role === "admin" ? "مدير" : "عضو"}</Badge>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-right ${
                    activeTab === item.value
                      ? "bg-[#0D5D48] text-white shadow-md shadow-[#0D5D48]/20"
                      : "text-gray-600 hover:bg-[#E8F5F0] hover:text-[#0D5D48]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-[#E5E5DF]">
              <Link to="/" className="text-sm text-gray-500 hover:text-[#0D5D48] transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                العودة للموقع
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A2E]">مرحباً، {user?.name} 👋</h2>
                <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("ar-SY", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      {stat.trend > 0 && (
                        <span className="text-xs text-green-600 flex items-center gap-0.5 font-medium">
                          <ArrowUpRight className="w-3 h-3" /> +{stat.trend}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</p>
                    {stat.sub && <p className="text-[10px] text-gray-400 mt-1">{stat.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Active Orders */}
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">طلباتي النشطة</h3>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50 overflow-hidden mb-8">
                {activeOrders.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {activeOrders.map((order) => {
                      const colors = statusColors[order.status as keyof typeof statusColors] || statusColors.pending;
                      return (
                        <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-gray-400">{order.orderNumber}</span>
                              <Badge className={`${colors.bg} ${colors.text} border-0 text-[10px] px-2 py-0`}>
                                {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-[#1A1A2E] line-clamp-1">{order.serviceTitle}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{order.buyerName} | {new Date(order.createdAt).toLocaleDateString("ar-SY")}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-[#0D5D48] whitespace-nowrap">{parseFloat(order.totalAmount).toLocaleString()} ل.س</span>
                            <Button variant="outline" size="sm" className="rounded-xl text-xs h-9 border-[#E5E5DF]">
                              <Eye className="w-3.5 h-3.5" />
                              عرض التفاصيل
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">لا توجد طلبات نشطة في الوقت الحالي</p>
                    <Link to="/services">
                      <Button variant="link" className="text-[#0D5D48] text-xs underline">تصفح الخدمات المتوفرة</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">طلباتي</h2>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-right text-xs">رقم الطلب</TableHead>
                      <TableHead className="text-right text-xs">الخدمة</TableHead>
                      <TableHead className="text-right text-xs">الحالة</TableHead>
                      <TableHead className="text-right text-xs">المبلغ</TableHead>
                      <TableHead className="text-right text-xs">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? orders.map((order) => {
                      const colors = statusColors[order.status as keyof typeof statusColors] || statusColors.pending;
                      return (
                        <TableRow key={order.id} className="hover:bg-gray-50/50">
                          <TableCell className="text-xs font-mono">{order.orderNumber}</TableCell>
                          <TableCell className="text-sm font-medium">{order.serviceTitle}</TableCell>
                          <TableCell>
                            <Badge className={`${colors.bg} ${colors.text} border-0 text-[10px] px-2 py-0`}>
                              {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-bold text-[#0D5D48]">
                            {parseFloat(order.totalAmount).toLocaleString()} ل.س
                          </TableCell>
                          <TableCell className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("ar-SY")}</TableCell>
                        </TableRow>
                      );
                    }) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-gray-400 text-sm">لا توجد سجلات طلبات</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === "wallet" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">محفظتي</h2>

              <div className="bg-gradient-to-br from-[#0D5D48] to-[#094533] rounded-3xl p-10 text-white mb-8 text-center shadow-xl shadow-[#0D5D48]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-3">الرصيد القابل للسحب</p>
                <div className="flex items-baseline justify-center gap-2 mb-8">
                  <p className="text-5xl font-extrabold">{balance.toLocaleString()}</p>
                  <span className="text-xl font-medium opacity-80">ل.س</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button className="bg-white text-[#0D5D48] hover:bg-gray-100 rounded-2xl px-8 h-12 font-bold shadow-lg shadow-black/10">
                    إيداع رصيد
                  </Button>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 h-12 font-bold backdrop-blur-sm">
                    طلب سحب
                  </Button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">سجل العمليات</h3>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-right text-xs">التاريخ</TableHead>
                      <TableHead className="text-right text-xs">النوع</TableHead>
                      <TableHead className="text-right text-xs">المبلغ</TableHead>
                      <TableHead className="text-right text-xs">الرصيد بعد</TableHead>
                      <TableHead className="text-right text-xs">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletTransactions.length > 0 ? walletTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-gray-50/50">
                        <TableCell className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString("ar-SY")}</TableCell>
                        <TableCell className={`text-xs font-bold ${transactionTypeColors[tx.type as keyof typeof transactionTypeColors] || ""}`}>
                          {transactionTypeLabels[tx.type as keyof typeof transactionTypeLabels] || tx.type}
                        </TableCell>
                        <TableCell className={`text-sm font-extrabold ${parseFloat(tx.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {parseFloat(tx.amount) >= 0 ? "+" : ""}{parseFloat(tx.amount).toLocaleString()} ل.س
                        </TableCell>
                        <TableCell className="text-sm font-medium">{parseFloat(tx.balanceAfter || "0").toLocaleString()} ل.س</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[tx.status as keyof typeof statusColors]?.bg || "bg-gray-50"} ${statusColors[tx.status as keyof typeof statusColors]?.text || "text-gray-600"} border-0 text-[10px] px-2 py-0`}>
                            {statusLabels[tx.status as keyof typeof statusLabels] || tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-gray-400 text-sm">لا توجد عمليات سابقة</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">محادثاتي</h2>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50 overflow-hidden divide-y divide-gray-100">
                {conversations.length > 0 ? conversations.map((conv) => (
                  <div key={conv.id} className="p-5 flex items-center gap-4 hover:bg-[#FAFBF7] transition-all cursor-pointer group">
                    <div className="relative">
                      <img src={conv.otherAvatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${conv.otherName}`} alt={conv.otherName} className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                      {(conv as any).unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                          {(conv as any).unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-[#1A1A2E] text-base">{conv.otherName}</h4>
                        <span className="text-[10px] text-gray-400">{new Date(conv.lastMessageAt || "").toLocaleTimeString("ar-SY", { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1 italic">"{conv.lastMessage || "بدء محادثة جديدة..."}"</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20">
                    <MessageCircle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">ليس لديك محادثات نشطة حالياً</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab - Placeholder */}
          {activeTab === "notifications" && (
            <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
              <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A2E]">قريباً جداً</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                نحن نعمل على توفير نظام إشعارات فوري لإبقائك على اطلاع بكل جديد في حسابك.
              </p>
            </div>
          )}

          {/* Profile & Settings - Placeholders */}
          {(activeTab === "profile" || activeTab === "settings") && (
            <div className="max-w-xl mx-auto text-center py-20 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-20 h-20 bg-[#E8F5F0] text-[#0D5D48] rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Settings className="w-10 h-10 animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#1A1A2E]">قيد التطوير</h3>
              <p className="text-gray-500 mt-3 text-sm italic">"نحن بصدد تحسين تجربة إدارة الحساب لتكون أكثر سلاسة وأماناً"</p>
              <Button onClick={() => setActiveTab("dashboard")} className="mt-8 bg-[#0D5D48] rounded-xl px-10">العودة للرئيسية</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
