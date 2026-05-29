import { useState } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Users, Package, ShoppingCart, Wallet, AlertTriangle,
  CheckCircle, ChevronLeft, Eye, Check, X, RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/layout/Header";
import { statusLabels, statusColors } from "@/lib/mockData";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";

const sidebarItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", value: "dashboard" },
  { icon: Users, label: "المستخدمون", value: "users" },
  { icon: Package, label: "الخدمات", value: "services" },
  { icon: ShoppingCart, label: "الطلبات", value: "orders" },
  { icon: Wallet, label: "السحوبات", value: "withdrawals" },
  { icon: CheckCircle, label: "الإيداعات", value: "deposits" },
  { icon: AlertTriangle, label: "النزاعات", value: "disputes" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const utils = trpc.useUtils();

  // Queries
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, {
    retry: false,
    staleTime: 30000,
  });
  const { data: users, isLoading: usersLoading } = trpc.admin.users.useQuery(undefined, { enabled: activeTab === "users" });
  const { data: pendingServices, isLoading: servicesLoading } = trpc.admin.services.useQuery(undefined, { enabled: activeTab === "dashboard" || activeTab === "services" });
  const { data: recentOrders, isLoading: ordersLoading } = trpc.admin.orders.useQuery(undefined, { enabled: activeTab === "orders" });
  const { data: withdrawals } = trpc.admin.withdrawals.useQuery(undefined, { enabled: activeTab === "withdrawals" });
  const { data: deposits } = trpc.admin.deposits.useQuery(undefined, { enabled: activeTab === "deposits" });

  // Mutations
  const approveService = trpc.admin.approveService.useMutation({
    onSuccess: () => {
      toast.success("تم قبول الخدمة بنجاح");
      utils.admin.services.invalidate();
    }
  });

  const rejectService = trpc.admin.rejectService.useMutation({
    onSuccess: () => {
      toast.error("تم رفض الخدمة");
      utils.admin.services.invalidate();
    }
  });

  const approveDeposit = trpc.admin.approveDeposit.useMutation({
    onSuccess: () => {
      toast.success("تم شحن الرصيد للمستخدم بنجاح");
      utils.admin.deposits.invalidate();
      utils.admin.stats.invalidate();
    }
  });

  const updateWithdrawal = trpc.admin.updateWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث حالة طلب السحب");
      utils.admin.withdrawals.invalidate();
    }
  });

  const dashboardStats = [
    { label: "المستخدمون", value: stats?.users ?? 0, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "الخدمات", value: stats?.services ?? 0, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "الطلبات", value: stats?.orders ?? 0, icon: ShoppingCart, color: "bg-amber-50 text-amber-600" },
    { label: "رصيد المحافظ", value: stats?.totalWalletBalance ?? 0, isCurrency: true, icon: Wallet, color: "bg-green-50 text-green-600" },
    { label: "معدل الإنجاز", value: stats?.completionRate ?? 0, isPercent: true, icon: CheckCircle, color: "bg-[#E8F5F0] text-[#0D5D48]" },
    { label: "النزاعات", value: stats?.disputes ?? 0, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />
      <div className="pt-[72px] flex">
        <aside className="hidden lg:block w-64 shrink-0 bg-white border-l border-[#E5E5DF] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-lg shadow-red-200">
                <span className="text-white font-bold text-lg">أ</span>
              </div>
              <div>
                <p className="font-bold text-[#1A1A2E] text-sm">لوحة الإدارة</p>
                <Badge className="bg-red-50 text-red-600 border-0 text-[10px] py-0 px-2 h-4">مسؤول النظام</Badge>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button key={item.value} onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-right ${activeTab === item.value ? "bg-[#0D5D48] text-white shadow-lg shadow-[#0D5D48]/20" : "text-gray-600 hover:bg-[#E8F5F0] hover:text-[#0D5D48]"}`}>
                  <item.icon className="w-5 h-5" />{item.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-[#E5E5DF]">
              <Link to="/" className="text-sm text-gray-500 hover:text-[#0D5D48] flex items-center gap-2 px-4">
                <ChevronLeft className="w-4 h-4" />العودة للموقع
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-8">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#1A1A2E]">لوحة التحكم العامة</h2>
                <Button variant="outline" size="sm" onClick={() => utils.admin.stats.invalidate()} className="rounded-xl gap-2 h-9">
                  <RefreshCcw className="w-4 h-4" /> تحديث البيانات
                </Button>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {dashboardStats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-[#1A1A2E]">
                      {stat.isCurrency ? `${Number(stat.value).toLocaleString()} ل.س` : stat.isPercent ? `${stat.value}%` : Number(stat.value).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-[#1A1A2E]">الخدمات المعلقة</h3>
                    <Badge variant="secondary" className="bg-[#E8F5F0] text-[#0D5D48] border-0">{pendingServices?.length ?? 0}</Badge>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {pendingServices?.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-[#0D5D48]/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1A1A2E] line-clamp-1">{service.title}</p>
                            <p className="text-[10px] text-gray-500">{service.sellerName} | {service.categoryName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" className="w-8 h-8 rounded-lg bg-green-600 hover:bg-green-700" onClick={() => approveService.mutate({ id: service.id })}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" className="w-8 h-8 rounded-lg" onClick={() => rejectService.mutate({ id: service.id })}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!pendingServices || pendingServices.length === 0) && (
                      <p className="text-gray-400 text-center py-10 text-sm italic">لا توجد خدمات بانتظار المراجعة</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[#E5E5DF]/50">
                  <h3 className="font-bold text-[#1A1A2E] mb-6">سرعة الوصول</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab("users")} className="p-4 bg-blue-50 text-blue-600 rounded-2xl text-center hover:bg-blue-100 transition-colors">
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-bold">إدارة الأعضاء</span>
                    </button>
                    <button onClick={() => setActiveTab("withdrawals")} className="p-4 bg-amber-50 text-amber-600 rounded-2xl text-center hover:bg-amber-100 transition-colors">
                      <Wallet className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-bold">طلبات السحب</span>
                    </button>
                    <button onClick={() => setActiveTab("disputes")} className="p-4 bg-red-50 text-red-600 rounded-2xl text-center hover:bg-red-100 transition-colors">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-bold">النزاعات</span>
                    </button>
                    <button onClick={() => setActiveTab("orders")} className="p-4 bg-[#E8F5F0] text-[#0D5D48] rounded-2xl text-center hover:bg-[#D4EBE1] transition-colors">
                      <ShoppingCart className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-xs font-bold">كل الطلبات</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">المستخدمون</h2>
              <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5DF]/50 overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-right">المستخدم</TableHead><TableHead className="text-right">الدور</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">تاريخ الانضمام</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {users?.map((u) => (
                      <TableRow key={u.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={u.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt="" className="w-10 h-10 rounded-2xl object-cover" />
                            <div><p className="font-bold text-sm text-[#1A1A2E]">{u.name}</p><p className="text-[10px] text-gray-500">{u.email}</p></div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-600 border-0 text-[10px]">{u.role}</Badge></TableCell>
                        <TableCell><Badge className={`${u.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"} border-0 text-[10px]`}>{u.status}</Badge></TableCell>
                        <TableCell className="text-xs text-gray-500">{new Date(u.createdAt || "").toLocaleDateString("ar-SY")}</TableCell>
                        <TableCell><Button size="sm" variant="outline" className="rounded-xl h-8 text-xs">إدارة</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">كل الخدمات</h2>
              <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5DF]/50 overflow-hidden">
                <Table>
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="text-right">الخدمة</TableHead><TableHead className="text-right">البائع</TableHead><TableHead className="text-right">السعر</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {pendingServices?.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell><p className="font-bold text-sm line-clamp-1">{service.title}</p></TableCell>
                        <TableCell className="text-sm font-medium">{service.sellerName}</TableCell>
                        <TableCell className="text-sm font-black text-[#0D5D48]">{Number(service.price).toLocaleString()} ل.س</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{service.status}</Badge></TableCell>
                        <TableCell><div className="flex gap-2"><Button onClick={() => approveService.mutate({ id: service.id })} size="sm" className="bg-green-600 rounded-lg h-8 px-3 text-xs">قبول</Button><Button onClick={() => rejectService.mutate({ id: service.id })} variant="destructive" size="sm" className="rounded-lg h-8 px-3 text-xs">رفض</Button></div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "withdrawals" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">طلبات السحب</h2>
              <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5DF]/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الوسيلة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals?.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <img src={w.userAvatar || ""} className="w-8 h-8 rounded-full" />
                             <span className="text-sm font-bold">{w.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-black text-red-600">{Number(w.amount).toLocaleString()} ل.س</TableCell>
                        <TableCell className="text-xs">{w.method} - {w.accountName} ({w.accountNumber})</TableCell>
                        <TableCell><Badge variant="outline">{w.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 h-8 text-[10px]" onClick={() => updateWithdrawal.mutate({ id: w.id, status: "approved" })}>قبول</Button>
                            <Button size="sm" variant="destructive" className="h-8 text-[10px]" onClick={() => updateWithdrawal.mutate({ id: w.id, status: "rejected" })}>رفض</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "deposits" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">طلبات الإيداع (شحن الرصيد)</h2>
              <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5DF]/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                      <TableHead className="text-right">الوسيلة</TableHead>
                      <TableHead className="text-right">الرقم المرجعي</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deposits?.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell><span className="text-sm font-bold">{d.userName}</span></TableCell>
                        <TableCell className="text-sm font-black text-green-600">{Number(d.amount).toLocaleString()} ل.س</TableCell>
                        <TableCell className="text-xs">{d.method} {d.senderPhone && `(${d.senderPhone})`}</TableCell>
                        <TableCell className="text-xs font-mono">{d.transactionNumber}</TableCell>
                        <TableCell>
                          {d.status === "pending" ? (
                            <Button 
                              size="sm" 
                              className="bg-[#0D5D48] h-8 text-[10px]" 
                              onClick={() => approveDeposit.mutate({ id: d.id, userId: d.userId, amount: d.amount })}
                            >
                              تأكيد الشحن
                            </Button>
                          ) : (
                            <Badge className="bg-green-50 text-green-600 border-0">تم القبول</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "disputes" && (
            <div className="text-center py-32 animate-in zoom-in-95 duration-500">
              <AlertTriangle className="w-20 h-20 text-gray-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-[#1A1A2E]">النزاعات</h3>
              <p className="text-gray-400 mt-2 max-w-sm mx-auto">كل شيء يسير بسلاسة! لا توجد شكاوى أو نزاعات بين المستخدمين حالياً.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
