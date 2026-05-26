import { useParams, Link } from "react-router";
import { Star, ShoppingBag, ShieldCheck, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/cards/ServiceCard";
import { trpc } from "@/providers/trpc";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { useState } from "react";

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>();
  const sellerId = parseInt(id || "0");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Queries
  const { data: seller, isLoading: sellerLoading } = trpc.sellers.profile.useQuery({ id: sellerId }, { enabled: !!sellerId });
  const { data: sellerServices, isLoading: servicesLoading } = trpc.services.bySeller.useQuery({ sellerId }, { enabled: !!sellerId });
  const { data: sellerReviews } = trpc.reviews.bySeller.useQuery({ sellerId }, { enabled: !!sellerId });

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBF7]">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 border-4 border-[#0D5D48] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-[#FAFBF7]">
        <Header />
        <div className="pt-24 text-center py-20 px-4">
          <ShieldCheck className="w-20 h-20 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#1A1A2E] mb-2">عذراً، هذا البائع غير متوفر حالياً</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">ربما قام بتغيير إعدادات الخصوصية أو تم حذف الملف الشخصي.</p>
          <Button asChild className="bg-[#0D5D48] rounded-2xl h-12 px-10">
            <Link to="/sellers">قائمة البائعين الموثقين</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />

      {/* Hero Section */}
      <section className="pt-[72px] relative">
        <div className="absolute inset-x-0 h-48 bg-gradient-to-r from-[#0D5D48] via-[#094533] to-[#0D5D48]" />
        <div className="max-w-[1200px] mx-auto px-4 pt-24 relative z-10">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 flex flex-col md:flex-row items-center md:items-end gap-10">
              <div className="relative group -mt-20 md:-mt-16">
                 <img 
                    src={seller.avatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${seller.name}`} 
                    alt={seller.name} 
                    className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500" 
                 />
                 <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white rounded-full animate-pulse" />
              </div>
              
              <div className="flex-1 text-center md:text-right">
                 <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h1 className="text-[#1A1A2E] text-3xl sm:text-4xl font-black">{seller.name}</h1>
                    <Badge className="bg-amber-50 text-amber-600 border border-amber-100 font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider text-[10px]">
                       {(seller as any).level || "بائع موثوق"}
                    </Badge>
                 </div>
                 
                 <p className="text-gray-500 text-sm max-w-2xl leading-relaxed mb-6 italic">"{seller.bio || "بائع خبير في منصة خدماتي يسعى لتقديم الأطول لعملائه."}"</p>
                 
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                    <div className="flex items-center gap-2">
                       <Zap className="w-5 h-5 text-amber-400" />
                       <span className="text-sm font-bold text-[#1A1A2E]">{seller.rating} <span className="text-gray-400 font-normal">تقييم النجوم</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                       <ShoppingBag className="w-5 h-5" />
                       <span className="text-sm font-bold">{seller.totalOrders} <span className="font-normal">طلب مكتمل</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                       <Globe className="w-5 h-5" />
                       <span className="text-sm font-bold">100% <span className="font-normal">سرعة الاستجابة</span></span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                  <Button 
                    onClick={() => setIsChatOpen(true)}
                    className="flex-1 md:w-40 bg-[#0D5D48] hover:bg-[#094533] text-white rounded-2xl h-14 font-black shadow-lg shadow-[#0D5D48]/20 transition-all active:scale-[0.98]"
                  >
                     تواصل معه
                  </Button>
              </div>
           </div>
        </div>
      </section>

      {/* Tabs Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <Tabs defaultValue="services" className="space-y-10">
          <TabsList className="bg-white border border-[#E5E5DF] rounded-2xl p-1.5 h-auto shadow-sm inline-flex">
            <TabsTrigger value="services" className="rounded-xl px-10 py-3 text-sm font-black data-[state=active]:bg-[#0D5D48] data-[state=active]:text-white transition-all">
              خدمات البائع ({sellerServices?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl px-10 py-3 text-sm font-black data-[state=active]:bg-[#0D5D48] data-[state=active]:text-white transition-all">
              آراء العملاء ({sellerReviews?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-xl px-10 py-3 text-sm font-black data-[state=active]:bg-[#0D5D48] data-[state=active]:text-white transition-all">
              السيرة الذاتية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="animate-in fade-in duration-500 outline-none">
            {servicesLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-72 bg-white rounded-3xl animate-pulse" />
                  ))}
               </div>
            ) : sellerServices && sellerServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sellerServices.map((service: { id: number; sellerId: number; title: string; slug: string; price: string; images: unknown; rating: string | null; totalReviews: number | null; featured: boolean | null; deliveryTime: number | null }, i: number) => (
                  <div key={service.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                    <ServiceCard
                      id={service.id}
                      sellerId={service.sellerId}
                      title={service.title}
                      slug={service.slug ?? ""}
                      price={service.price}
                      images={service.images as string[] ?? []}
                      rating={service.rating ?? "0"}
                      totalReviews={service.totalReviews ?? 0}
                      featured={service.featured ?? false}
                      deliveryTime={service.deliveryTime ?? 3}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                <ShoppingBag className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">لا يوجد خدمات معروضة حالياً من قبل هذا البائع</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="animate-in fade-in duration-500 outline-none">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#E5E5DF]/50">
              <h3 className="text-[#1A1A2E] font-black text-2xl mb-8">تقييمات العملاء</h3>
              {sellerReviews && sellerReviews.length > 0 ? (
                <div className="space-y-10">
                  {sellerReviews.map((review: { id: number; reviewerAvatar: string | null; reviewerName: string; rating: number; createdAt: string | null; comment: string | null; serviceTitle?: string }) => (
                    <div key={review.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl hover:bg-gray-50 transition-colors group">
                      <img src={review.reviewerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.reviewerName}`} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <div>
                             <h4 className="font-black text-[#1A1A2E]">{review.reviewerName}</h4>
                             <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                                ))}
                             </div>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400">{new Date(review.createdAt || "").toLocaleDateString("ar-SY")}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{review.comment}"</p>
                        <Badge variant="secondary" className="bg-[#E8F5F0] text-[#0D5D48] border-0 text-[10px] font-bold px-3">
                           بخصوص: {review.serviceTitle}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                   <Star className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                   <p className="text-gray-400">لا توجد تقييمات لهذا البائع بعد.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about" className="animate-in fade-in duration-500 outline-none">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#E5E5DF]/50">
              <h3 className="text-[#1A1A2E] font-black text-2xl mb-6">نبذة شخصية</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-10">{seller.bio || "بائع متميز في منصة خدماتي يسير بخطى ثابتة نحو تحقيق أفضل النتائج لعملائه."}</p>

              <h4 className="text-[#1A1A2E] font-black text-lg mb-4 flex items-center gap-3">
                 <div className="w-2 h-6 bg-amber-400 rounded-full" />
                 إحصائيات الأداء
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 hover:border-[#0D5D48]/30 transition-colors">
                  <p className="text-3xl font-black text-[#0D5D48] mb-1">{seller.totalOrders}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">إجمالي المبيعات</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 hover:border-[#0D5D48]/30 transition-colors">
                  <p className="text-3xl font-black text-[#0D5D48] mb-1">{seller.completedOrders}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">طلبات مكتملة</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 hover:border-[#0D5D48]/30 transition-colors">
                  <p className="text-3xl font-black text-[#C49A2C] mb-1">{seller.rating}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">متوسط النجوم</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl text-center border border-gray-100 hover:border-[#0D5D48]/30 transition-colors">
                  <p className="text-3xl font-black text-blue-600 mb-1">100%</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">نسبة الرضا</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      <ChatDialog 
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
        receiverUnionId={seller.unionId}
        receiverName={seller.name}
        receiverAvatar={seller.avatar}
      />
    </div>
  );
}
