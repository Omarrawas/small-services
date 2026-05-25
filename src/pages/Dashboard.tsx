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
import { orders, walletTransactions, conversations, notifications, statusLabels, statusColors, transactionTypeLabels, transactionTypeColors } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

  const activeOrders = orders.filter((o) => o.status === "in_progress" || o.status === "pending");
  const balance = 125000;

  const stats = [
    { label: "رصيد المحفظة", value: `${balance.toLocaleString()} ل.س`, trend: 5, icon: Wallet, color: "bg-[#E8F5F0] text-[#0D5D48]" },
    { label: "طلباتي", value: "8", sub: "2 نشط", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "محادثات", value: "3", sub: "1 جديد", icon: MessageCircle, color: "bg-purple-50 text-purple-600" },
    { label: "إشعارات", value: "5", sub: "2 غير مقروء", icon: Bell, color: "bg-amber-50 text-amber-600" },
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
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-[#1A1A2E]">{user?.name || "مستخدم"}</p>
                <Badge variant="secondary" className="text-xs">مشتري</Badge>
              </div>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-right ${
                    activeTab === item.value
                      ? "bg-[#0D5D48] text-white"
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
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A2E]">مرحباً، {user?.name || "مستخدم"}</h2>
                <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString("ar-SY", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      {stat.trend && (
                        <span className="text-xs text-green-600 flex items-center gap-0.5">
                          <ArrowUpRight className="w-3 h-3" /> +{stat.trend}%
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</p>
                    {stat.sub && <p className="text-xs text-gray-400">{stat.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Active Orders */}
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">طلباتي النشطة</h3>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden mb-8">
                {activeOrders.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {activeOrders.map((order) => {
                      const colors = statusColors[order.status] || statusColors.pending;
                      return (
                        <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-400">{order.orderNumber}</span>
                              <Badge className={`${colors.bg} ${colors.text} border-0 text-xs`}>
                                {statusLabels[order.status] || order.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-[#1A1A2E] line-clamp-1">{order.serviceTitle}</h4>
                            <p className="text-sm text-gray-500">{order.sellerName} | {order.createdAt}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#0D5D48]">{parseFloat(order.totalAmount).toLocaleString()} ل.س</span>
                            <Button variant="outline" size="sm" className="rounded-lg text-xs">
                              <Eye className="w-3.5 h-3.5" />
                              عرض
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-10">لا توجد طلبات نشطة</p>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">طلباتي</h2>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const colors = statusColors[order.status] || statusColors.pending;
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="text-sm font-medium">{order.orderNumber}</TableCell>
                          <TableCell className="text-sm">{order.serviceTitle}</TableCell>
                          <TableCell>
                            <Badge className={`${colors.bg} ${colors.text} border-0 text-xs`}>
                              {statusLabels[order.status] || order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-[#0D5D48]">
                            {parseFloat(order.totalAmount).toLocaleString()} ل.س
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">{order.createdAt}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === "wallet" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">محفظتي</h2>

              <div className="bg-[#0D5D48] rounded-2xl p-8 text-white mb-6 text-center">
                <p className="text-white/80 text-sm mb-2">الرصيد الحالي</p>
                <p className="text-4xl font-bold">{balance.toLocaleString()} <span className="text-xl">ل.س</span></p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button className="bg-white text-[#0D5D48] hover:bg-gray-100 rounded-xl px-6">
                    إيداع
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-xl px-6">
                    سحب
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">النوع</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الرصيد بعد</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm text-gray-500">{tx.createdAt}</TableCell>
                        <TableCell className={`text-sm font-medium ${transactionTypeColors[tx.type] || ""}`}>
                          {transactionTypeLabels[tx.type] || tx.type}
                        </TableCell>
                        <TableCell className={`text-sm font-semibold ${parseFloat(tx.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {parseFloat(tx.amount) >= 0 ? "+" : ""}{parseFloat(tx.amount).toLocaleString()} ل.س
                        </TableCell>
                        <TableCell className="text-sm">{parseFloat(tx.balanceAfter || "0").toLocaleString()} ل.س</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[tx.status]?.bg || "bg-gray-50"} ${statusColors[tx.status]?.text || "text-gray-600"} border-0 text-xs`}>
                            {statusLabels[tx.status] || tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">محادثاتي</h2>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden divide-y divide-gray-100">
                {conversations.map((conv) => (
                  <div key={conv.id} className="p-5 flex items-center gap-4 hover:bg-[#FAFBF7] transition-colors cursor-pointer">
                    <div className="relative">
                      <img src={conv.otherAvatar} alt={conv.sellerName} className="w-12 h-12 rounded-full object-cover" />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-[#1A1A2E] text-sm">{conv.sellerName}</h4>
                        <span className="text-xs text-gray-400">{conv.lastMessageAt}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{conv.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">الإشعارات</h2>
              <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-5 flex items-start gap-4 ${!notif.isRead ? "bg-[#E8F5F0]/30" : ""}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notif.type === "order" ? "bg-blue-50 text-blue-600" :
                      notif.type === "message" ? "bg-purple-50 text-purple-600" :
                      notif.type === "payment" ? "bg-green-50 text-green-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {notif.type === "order" ? <Package className="w-5 h-5" /> :
                       notif.type === "message" ? <MessageCircle className="w-5 h-5" /> :
                       notif.type === "payment" ? <Wallet className="w-5 h-5" /> :
                       <Star className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{notif.title}</h4>
                      <p className="text-sm text-gray-500">{notif.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.createdAt}</p>
                    </div>
                    {!notif.isRead && <div className="w-2.5 h-2.5 bg-[#0D5D48] rounded-full shrink-0 mt-2" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">الملف الشخصي</h2>
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="text-center mb-6">
                  <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-3" />
                  <p className="font-semibold text-lg">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                    <input type="text" defaultValue={user?.name || ""} className="w-full h-10 px-3 rounded-lg border border-[#E5E5DF] bg-[#FAFBF7] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input type="email" defaultValue={user?.email || ""} className="w-full h-10 px-3 rounded-lg border border-[#E5E5DF] bg-[#FAFBF7] text-sm" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <input type="tel" defaultValue="+963 987 654 321" className="w-full h-10 px-3 rounded-lg border border-[#E5E5DF] bg-[#FAFBF7] text-sm" />
                  </div>
                  <Button className="w-full bg-[#0D5D48] hover:bg-[#094533] rounded-xl">حفظ التغييرات</Button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">الإعدادات</h2>
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">إشعارات البريد الإلكتروني</p>
                    <p className="text-sm text-gray-500">استلام إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <div className="w-12 h-6 bg-[#0D5D48] rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">إشعارات المتصفح</p>
                    <p className="text-sm text-gray-500">استلام إشعارات في المتصفح</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">الوضع الليلي</p>
                    <p className="text-sm text-gray-500">تفعيل الوضع الليلي في اللوحة</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow" />
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <Button variant="destructive" className="w-full rounded-xl">حذف الحساب</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
