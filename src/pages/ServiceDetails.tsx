import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Star, Clock, Shield, Check, ChevronLeft, AlertCircle, RefreshCcw, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { ChatDialog } from "@/components/chat/ChatDialog";

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Queries
  const { data: service, isLoading, error } = trpc.services.bySlug.useQuery({ slug: slug || "" }, { enabled: !!slug });
  const { data: serviceReviews } = trpc.reviews.byService.useQuery({ serviceId: service?.id || 0 }, { enabled: !!service?.id });
  const { data: seller } = trpc.sellers.profile.useQuery({ id: service?.sellerId || 0 }, { enabled: !!service?.sellerId });

  // Mutations
  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      toast.success("تم تقديم طلبك بنجاح!");
      navigate("/dashboard?tab=orders");
    },
    onError: (err) => {
      toast.error(err.message || "فشل في تقديم الطلب");
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBF7]">
        <Header />
        <div className="max-w-[1200px] mx-auto px-4 py-32 text-center">
          <div className="w-16 h-16 border-4 border-[#0D5D48] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">جاري تحميل الخدمة...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#FAFBF7]">
        <Header />
        <div className="max-w-[1200px] mx-auto px-4 py-32 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">عذراً، لم نجد هذه الخدمة</h2>
          <p className="text-gray-500 mb-8">ربما تم حذف الخدمة أو أن الرابط غير صحيح.</p>
          <Button asChild className="bg-[#0D5D48] rounded-xl px-8 h-12">
            <Link to="/services">تصفح كل الخدمات</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = service.images as string[] || [];
  const mainImage = images[selectedImage] || "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800";
  const priceNum = parseFloat(service.price);
  const extras = (service as any).extras as any[] || [];

  const extrasTotal = selectedExtras.reduce((sum, idx) => {
    const extra = extras[idx];
    return extra ? sum + extra.price : sum;
  }, 0);
  const totalPrice = priceNum + extrasTotal;

  const toggleExtra = (idx: number) => {
    setSelectedExtras((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleOrder = () => {
    createOrder.mutate({
      serviceSlug: service.slug,
      extras: selectedExtras.map(idx => extras[idx]),
    });
  };

  const reviews = serviceReviews ?? [];
  const avgRating = service.rating || "0";

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r: { rating: number }) => r.rating === stars).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />

      {/* Breadcrumb + Header */}
      <div className="pt-[72px] bg-white border-b border-[#E5E5DF] shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-medium">
            <Link to="/" className="hover:text-[#0D5D48] transition-colors">الرئيسية</Link>
            <ChevronLeft className="w-3 h-3" />
            <Link to="/services" className="hover:text-[#0D5D48] transition-colors">الخدمات</Link>
            <ChevronLeft className="w-3 h-3" />
            <span className="text-[#1A1A2E] line-clamp-1">{service.title}</span>
          </div>

          <h1 className="text-[#1A1A2E] text-2xl sm:text-3xl font-black mb-6 leading-tight">{service.title}</h1>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-100">
              <img src={seller?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${seller?.name}`} alt={seller?.name || ""} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="font-bold text-sm text-[#1A1A2E]">{seller?.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold">{avgRating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <Badge className="bg-[#E8F5F0] text-[#0D5D48] border-0 text-[10px] font-bold px-3">خدمة موثوقة</Badge>
               <span className="text-xs text-gray-400">{service.totalReviews} مراجعة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Image Gallery */}
            <div className="mb-10">
              <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 mb-4 shadow-xl shadow-black/5 group relative">
                <img src={mainImage} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedImage === i ? "border-[#0D5D48] ring-4 ring-[#0D5D48]/10" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mb-10">
              <TabsList className="bg-white border border-[#E5E5DF] rounded-2xl p-1.5 h-auto w-full sm:w-auto shadow-sm">
                <TabsTrigger value="description" className="rounded-xl px-8 py-2.5 text-sm font-bold data-[state=active]:bg-[#0D5D48] data-[state=active]:text-white transition-all">
                  الوصف التفصيلي
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-xl px-8 py-2.5 text-sm font-bold data-[state=active]:bg-[#0D5D48] data-[state=active]:text-white transition-all">
                  آراء العملاء ({service.totalReviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#E5E5DF]/50">
                  <h3 className="text-[#1A1A2E] font-black text-xl mb-6 flex items-center gap-2">
                    <div className="w-2 h-6 bg-[#0D5D48] rounded-full" />
                    حول هذه الخدمة
                  </h3>
                  <div className="text-gray-600 leading-relaxed text-base space-y-4 whitespace-pre-line">
                    {service.description}
                  </div>

                  <Separator className="my-8" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[#1A1A2E] font-bold text-lg mb-4">المميزات الأساسية</h4>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-[#E8F5F0] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#0D5D48]" />
                          </div>
                          <span>جودة عالية واحترافية في الأداء</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="w-5 h-5 rounded-full bg-[#E8F5F0] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-[#0D5D48]" />
                          </div>
                          <span>تعديلات غير محدودة حتى الرضا التام</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h4 className="text-[#1A1A2E] font-bold text-sm mb-3">نصيحة أمان</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">اطلب دائماً عبر المنصة لضمان حقك المالي. نظام الضمان يحمي أموالك حتى تستلم عملك كاملاً.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#E5E5DF]/50">
                  <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                    <div className="text-center md:text-right shrink-0">
                      <div className="text-6xl font-black text-[#1A1A2E] mb-2">{avgRating}</div>
                      <div className="flex items-center gap-1 justify-center md:justify-start mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(parseFloat(avgRating)) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-[#0D5D48] bg-[#E8F5F0] px-4 py-1.5 rounded-full inline-block">
                        بناءً على {service.totalReviews} رأي
                      </p>
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      {ratingBreakdown.map((r) => (
                        <div key={r.stars} className="flex items-center gap-4">
                          <span className="text-xs font-bold text-gray-400 w-4">{r.stars}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-1000" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 w-10">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-10" />

                  <div className="space-y-8">
                    {reviews.length > 0 ? reviews.map((review: { id: number; rating: number; comment: string; createdAt: string; reviewerName: string; reviewerAvatar: string | null }) => (
                      <div key={review.id} className="group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <img src={review.reviewerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${review.reviewerName}`} alt="" className="w-12 h-12 rounded-2xl object-cover border border-gray-100" />
                            <div>
                              <p className="font-bold text-sm text-[#1A1A2E]">{review.reviewerName}</p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400">{new Date(review.createdAt || "").toLocaleDateString("ar-SY")}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed pr-16">{review.comment}</p>
                      </div>
                    )) : (
                      <div className="text-center py-10">
                        <Star className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">كن أول من يقيّم هذه الخدمة</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Order Card */}
              <div className="bg-[#0D5D48] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#0D5D48]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                
                <h4 className="text-sm font-bold opacity-70 uppercase tracking-widest mb-2">سعر الخدمة يبدأ من</h4>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-extrabold">{priceNum.toLocaleString()}</span>
                  <span className="text-lg opacity-80">ل.س</span>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3 text-sm bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md">
                    <Clock className="w-5 h-5 text-amber-300" />
                    <span>جاهزة للتسليم خلال <b>{service.deliveryTime} أيام</b></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm bg-white/10 px-4 py-3 rounded-2xl backdrop-blur-md">
                    <RefreshCcw className="w-5 h-5 text-blue-300" />
                    <span>تعديلات مجانية حتى الرضا</span>
                  </div>
                </div>

                {/* Extras */}
                {extras.length > 0 && (
                  <div className="mb-8">
                    <h5 className="text-xs font-black uppercase tracking-wider mb-4 opacity-70 text-center">إضافات مخصصة</h5>
                    <div className="space-y-2">
                      {extras.map((extra: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => toggleExtra(i)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                            selectedExtras.includes(i)
                              ? "bg-white text-[#0D5D48] border-white"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-3 text-right">
                             {selectedExtras.includes(i) ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-white/30" />}
                             <span className="text-sm font-bold">{extra.name}</span>
                          </div>
                          <span className="text-xs font-black">+{extra.price.toLocaleString()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-6 bg-white/10" />

                <div className="flex items-center justify-between mb-8 px-2">
                  <span className="text-sm opacity-70">إجمالي المبلغ</span>
                  <div className="text-right">
                    <p className="text-3xl font-black">{totalPrice.toLocaleString()} <span className="text-xs font-normal">ل.س</span></p>
                  </div>
                </div>

                <Button 
                   onClick={handleOrder}
                   disabled={createOrder.isPending}
                   className="w-full bg-white text-[#0D5D48] hover:bg-gray-100 rounded-2xl h-14 text-lg font-black shadow-lg shadow-black/10 active:scale-[0.98] transition-transform"
                >
                  {createOrder.isPending ? "جاري المعالجة..." : "اشترِ الخدمة الآن"}
                </Button>

                <p className="text-[10px] text-center mt-6 opacity-50 flex items-center justify-center gap-2">
                   <Shield className="w-3 h-3" />
                   مدفوعاتك آمنة ومضمونة 100%
                </p>
              </div>

              {/* Seller Mini Card */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#E5E5DF]/50">
                <div className="flex items-center gap-4 mb-6">
                  <img src={seller?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${seller?.name}`} alt="" className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm" />
                  <div>
                    <h4 className="font-black text-[#1A1A2E] text-lg">{seller?.name}</h4>
                    <p className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">{(seller as any)?.level || "بائع موثوق"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="p-3 bg-gray-50 rounded-2xl text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">الطلبات</p>
                      <p className="text-sm font-black text-[#1A1A2E]">{seller?.totalOrders}</p>
                   </div>
                   <div className="p-3 bg-gray-50 rounded-2xl text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">التقييم</p>
                      <p className="text-sm font-black text-[#1A1A2E]">{seller?.rating}</p>
                   </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-[#0D5D48] text-[#0D5D48] hover:bg-[#E8F5F0] rounded-2xl h-11 text-xs font-bold" asChild>
                    <Link to={`/sellers/${seller?.id}`}>الملف الشخصي</Link>
                  </Button>
                  <Button 
                    onClick={() => setIsChatOpen(true)}
                    variant="outline" 
                    className="w-12 h-11 border-gray-200 text-gray-400 hover:text-[#0D5D48] hover:border-[#0D5D48] rounded-2xl p-0"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>

                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      {seller && (
        <ChatDialog 
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          receiverUnionId={seller.unionId}
          receiverName={seller.name}
          receiverAvatar={seller.avatar}
        />
      )}
    </div>
  );
}
