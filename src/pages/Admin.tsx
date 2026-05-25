import { useState } from "react";
import { Link } from "react-router";
import {
  LayoutDashboard, Users, Package, ShoppingCart, Wallet, AlertTriangle,
  CheckCircle, ChevronLeft, Eye, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/layout/Header";
import { services as allServices, orders as allOrders, sellers, adminStats, statusLabels, statusColors } from "@/lib/mockData";

const sidebarItems = [
  { icon: LayoutDashboard, label: "لوحة التحكم", value: "dashboard" },
  { icon: Users, label: "المستخدمون", value: "users" },
  { icon: Package, label: "الخدمات", value: "services" },
  { icon: ShoppingCart, label: "الطلبات", value: "orders" },
  { icon: Wallet, label: "السحوبات", value: "withdrawals" },
  { icon: AlertTriangle, label: "النزاعات", value: "disputes" },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const pendingServices = allServices.filter((s) => s.status === "pending");

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />
      <div className="pt-[72px] flex">
        <aside className="hidden lg:block w-64 shrink-0 bg-white border-l border-[#E5E5DF] sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#0D5D48] flex items-center justify-center">
                <span className="text-white font-bold text-lg">أ</span>
              </div>
              <div>
                <p className="font-semibold text-[#1A1A2E]">الأدمن</p>
                <Badge className="bg-red-50 text-red-600 border-0 text-xs">مدير</Badge>
              </div>
            </div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button key={item.value} onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-right ${activeTab === item.value ? "bg-[#0D5D48] text-white" : "text-gray-600 hover:bg-[#E8F5F0] hover:text-[#0D5D48]"}`}>
                  <item.icon className="w-5 h-5" />{item.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t border-[#E5E5DF]">
              <Link to="/" className="text-sm text-gray-500 hover:text-[#0D5D48] flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />العودة للموقع
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 sm:p-8">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">لوحة التحكم</h2>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {adminStats.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.label === "النزاعات" ? "bg-red-50 text-red-600" : stat.label === "معدل الإنجاز" ? "bg-green-50 text-green-600" : "bg-[#E8F5F0] text-[#0D5D48]"}`}>
                        {stat.label === "المستخدمون" ? <Users className="w-5 h-5" /> : stat.label === "الخدمات" ? <Package className="w-5 h-5" /> : stat.label === "الطلبات" ? <ShoppingCart className="w-5 h-5" /> : stat.label === "رصيد المحافظ" ? <Wallet className="w-5 h-5" /> : stat.label === "النزاعات" ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      {stat.trend !== 0 && <span className={`text-xs ${stat.trend > 0 ? "text-green-600" : "text-red-600"}`}>{stat.trend > 0 ? "+" : ""}{stat.trend}%</span>}
                    </div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#1A1A2E]">{stat.isCurrency ? `${(stat.value / 1000000).toFixed(0)}M` : stat.isPercent ? `${stat.value}%` : stat.value.toLocaleString()}{stat.isCurrency ? " ل.س" : ""}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <h3 className="font-bold text-[#1A1A2E] mb-4">الإجراءات المعلقة</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#FAFBF7] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-[#0D5D48]" />
                      <div><p className="font-medium text-sm">خدمات بانتظار المراجعة</p><p className="text-xs text-gray-500">{pendingServices.length} خدمة</p></div>
                    </div>
                    <Button size="sm" className="bg-[#0D5D48] rounded-lg" onClick={() => setActiveTab("services")}>مراجعة</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#FAFBF7] rounded-xl">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-[#C49A2C]" />
                      <div><p className="font-medium text-sm">طلبات سحب</p><p className="text-xs text-gray-500">3 طلب</p></div>
                    </div>
                    <Button size="sm" className="bg-[#C49A2C] rounded-lg" onClick={() => setActiveTab("withdrawals")}>مراجعة</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#FAFBF7] rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div><p className="font-medium text-sm">نزاعات مفتوحة</p><p className="text-xs text-gray-500">2 نزاع</p></div>
                    </div>
                    <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => setActiveTab("disputes")}>حل</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">المستخدمون</h2>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-right">المستخدم</TableHead><TableHead className="text-right">الدور</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">الطلبات</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {sellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell><div className="flex items-center gap-3"><img src={seller.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /><span className="font-medium text-sm">{seller.name}</span></div></TableCell>
                        <TableCell><Badge className="bg-blue-50 text-blue-600 border-0">بائع</Badge></TableCell>
                        <TableCell><Badge className="bg-green-50 text-green-600 border-0">نشط</Badge></TableCell>
                        <TableCell className="text-sm">{seller.totalOrders}</TableCell>
                        <TableCell><div className="flex items-center gap-2"><Button size="sm" variant="outline" className="rounded-lg h-8"><Eye className="w-3.5 h-3.5" /></Button><Button size="sm" variant="outline" className="rounded-lg h-8 text-red-500 hover:bg-red-50"><X className="w-3.5 h-3.5" /></Button></div></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">الخدمات</h2>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-right">الخدمة</TableHead><TableHead className="text-right">البائع</TableHead><TableHead className="text-right">السعر</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">إجراءات</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {allServices.map((service) => {
                      const colors = statusColors[service.status] || statusColors.pending;
                      return (
                        <TableRow key={service.id}>
                          <TableCell><div className="flex items-center gap-3"><img src={service.images?.[0]} alt="" className="w-12 h-8 rounded object-cover" /><span className="font-medium text-sm line-clamp-1 max-w-[200px]">{service.title}</span></div></TableCell>
                          <TableCell className="text-sm">{sellers.find((s) => s.id === service.sellerId)?.name}</TableCell>
                          <TableCell className="text-sm font-semibold">{parseFloat(service.price).toLocaleString()} ل.س</TableCell>
                          <TableCell><Badge className={`${colors.bg} ${colors.text} border-0 text-xs`}>{statusLabels[service.status] || service.status}</Badge></TableCell>
                          <TableCell><div className="flex items-center gap-2"><Button size="sm" className="bg-[#0D5D48] rounded-lg h-8"><Check className="w-3.5 h-3.5" /></Button><Button size="sm" variant="outline" className="rounded-lg h-8 text-red-500 hover:bg-red-50"><X className="w-3.5 h-3.5" /></Button></div></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">الطلبات</h2>
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-right">رقم الطلب</TableHead><TableHead className="text-right">الخدمة</TableHead><TableHead className="text-right">المبلغ</TableHead><TableHead className="text-right">الحالة</TableHead><TableHead className="text-right">التاريخ</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {allOrders.map((order) => {
                      const colors = statusColors[order.status] || statusColors.pending;
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="text-sm font-medium">{order.orderNumber}</TableCell>
                          <TableCell className="text-sm">{order.serviceTitle}</TableCell>
                          <TableCell className="text-sm font-semibold text-[#0D5D48]">{parseFloat(order.totalAmount).toLocaleString()} ل.س</TableCell>
                          <TableCell><Badge className={`${colors.bg} ${colors.text} border-0 text-xs`}>{statusLabels[order.status] || order.status}</Badge></TableCell>
                          <TableCell className="text-sm text-gray-500">{order.createdAt}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "withdrawals" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">طلبات السحب</h2>
              <div className="bg-white rounded-2xl p-8 shadow text-center">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">لا توجد طلبات سحب حالياً</p>
              </div>
            </div>
          )}

          {activeTab === "disputes" && (
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">النزاعات</h2>
              <div className="bg-white rounded-2xl p-8 shadow text-center">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">لا توجد نزاعات حالياً</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
