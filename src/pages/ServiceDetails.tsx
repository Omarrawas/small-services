import { useState } from "react";
import { useParams, Link } from "react-router";
import { Star, Clock, Shield, Check, ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { services, sellers, reviews, categories } from "@/lib/mockData";

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 text-center py-20">
          <p className="text-xl text-gray-500">الخدمة غير موجودة</p>
          <Button asChild className="mt-4 bg-[#0D5D48]">
            <Link to="/services">العودة للخدمات</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const seller = sellers.find((s) => s.id === service.sellerId);
  const category = categories.find((c) => c.id === service.categoryId);
  const serviceReviews = reviews.filter((r) => r.serviceTitle === service.title);
  const mainImage = service.images?.[selectedImage] || "/images/service-1.jpg";
  const priceNum = parseFloat(service.price);

  const extrasTotal = selectedExtras.reduce((sum, idx) => {
    const extra = service.extras?.[idx];
    return extra ? sum + extra.price : sum;
  }, 0);
  const totalPrice = priceNum + extrasTotal;

  const toggleExtra = (idx: number) => {
    setSelectedExtras((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const avgRating = serviceReviews.length > 0
    ? (serviceReviews.reduce((s, r) => s + r.rating, 0) / serviceReviews.length).toFixed(1)
    : service.rating;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = serviceReviews.filter((r) => r.rating === stars).length;
    const pct = serviceReviews.length > 0 ? (count / serviceReviews.length) * 100 : 0;
    return { stars, count, pct };
  });

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />

      {/* Breadcrumb + Header */}
      <div className="pt-[72px] bg-white border-b border-[#E5E5DF]">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-[#0D5D48]">الرئيسية</Link>
            <ChevronLeft className="w-3 h-3" />
            <Link to="/services" className="hover:text-[#0D5D48]">الخدمات</Link>
            <ChevronLeft className="w-3 h-3" />
            {category && (
              <>
                <Link to={`/services?category=${category.slug}`} className="hover:text-[#0D5D48]">{category.nameAr}</Link>
                <ChevronLeft className="w-3 h-3" />
              </>
            )}
            <span className="text-[#1A1A2E]">{service.title}</span>
          </div>

          <h1 className="text-[#1A1A2E] text-2xl sm:text-3xl font-bold mb-4">{service.title}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={seller?.avatar} alt={seller?.name} className="w-9 h-9 rounded-full object-cover" />
              <span className="font-medium text-sm">{seller?.name}</span>
              {seller?.levelLabel && (
                <span className="text-xs bg-[#FDF6E3] text-[#C49A2C] px-2 py-0.5 rounded-full">{seller.levelLabel}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">{service.rating}</span>
              <span className="text-sm text-gray-500">({service.totalReviews})</span>
            </div>
            <Badge className="bg-green-50 text-green-700 border-0">نشط</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img src={mainImage} alt={service.title} className="w-full h-full object-cover" />
              </div>
              {service.images && service.images.length > 1 && (
                <div className="flex gap-2">
                  {service.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-[#0D5D48]" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="bg-white border border-[#E5E5DF] rounded-xl p-1 h-auto">
                <TabsTrigger value="description" className="rounded-lg px-5 py-2 data-[state=active]:bg-[#E8F5F0] data-[state=active]:text-[#0D5D48]">
                  الوصف
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg px-5 py-2 data-[state=active]:bg-[#E8F5F0] data-[state=active]:text-[#0D5D48]">
                  التقييمات ({service.totalReviews})
                </TabsTrigger>
                <TabsTrigger value="faq" className="rounded-lg px-5 py-2 data-[state=active]:bg-[#E8F5F0] data-[state=active]:text-[#0D5D48]">
                  الأسئلة
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <h3 className="text-[#1A1A2E] font-bold text-xl mb-4">وصف الخدمة</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>

                  {service.extras && service.extras.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <h4 className="text-[#1A1A2E] font-semibold text-lg mb-3">خدمات إضافية</h4>
                      <ul className="space-y-2">
                        {service.extras.map((extra, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-600">
                            <Check className="w-4 h-4 text-[#0D5D48] shrink-0" />
                            {extra.name} — {extra.price.toLocaleString()} ل.س (+{extra.deliveryTime} يوم)
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <Separator className="my-6" />
                  <h4 className="text-[#1A1A2E] font-semibold text-lg mb-3">ما ستحصل عليه</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-[#0D5D48] shrink-0" /> عمل احترافي بجودة عالية
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-[#0D5D48] shrink-0" /> تعديلات مجانية حتى الرضا
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-[#0D5D48] shrink-0" /> تسليم في الموعد المحدد
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-[#0D5D48] shrink-0" /> دعم فني متواصل
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  {/* Rating Summary */}
                  <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                    <div className="text-center sm:text-right">
                      <div className="text-5xl font-bold text-[#1A1A2E]">{avgRating}</div>
                      <div className="flex items-center gap-1 justify-center sm:justify-start my-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(parseFloat(avgRating)) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">{service.totalReviews} تقييم</p>
                    </div>
                    <div className="flex-1 w-full">
                      {ratingBreakdown.map((r) => (
                        <div key={r.stars} className="flex items-center gap-3 mb-1.5">
                          <span className="text-sm text-gray-500 w-3">{r.stars}</span>
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8">{r.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="mb-6" />

                  {/* Review Cards */}
                  <div className="space-y-5">
                    {serviceReviews.length > 0 ? serviceReviews.map((review) => (
                      <div key={review.id} className="pb-5 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-sm">{review.reviewerName}</p>
                            <p className="text-xs text-gray-400">{review.createdAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    )) : (
                      <p className="text-gray-400 text-center py-8">لا توجد تقييمات بعد</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <h3 className="text-[#1A1A2E] font-bold text-xl mb-4">الأسئلة الشائعة</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#FAFBF7] rounded-xl">
                      <p className="font-semibold text-[#1A1A2E] mb-2">كيف يعمل نظام الضمان المالي؟</p>
                      <p className="text-gray-600 text-sm">أموالك تبقى محجوزة في حساب الضمان حتى تستلم الخدمة وتؤكد رضاك عنها. بعدها يتم تحويل المبلغ للبائع.</p>
                    </div>
                    <div className="p-4 bg-[#FAFBF7] rounded-xl">
                      <p className="font-semibold text-[#1A1A2E] mb-2">ما هو وقت التسليم المتوقع؟</p>
                      <p className="text-gray-600 text-sm">وقت التسليم يختلف حسب الخدمة. يبدأ عادة من 24 ساعة ويصل إلى عدة أسابيع للمشاريع الكبيرة. يمكنك رؤية الوقت المتوقع في صفحة كل خدمة.</p>
                    </div>
                    <div className="p-4 bg-[#FAFBF7] rounded-xl">
                      <p className="font-semibold text-[#1A1A2E] mb-2">هل يمكنني طلب تعديلات؟</p>
                      <p className="text-gray-600 text-sm">نعم، يمكنك طلب تعديلات حتى تصل للنتيجة المطلوبة. معظم البائعين يقدمون تعديلات مجانية حتى الرضا الكامل.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Order Card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 text-sm">السعر</span>
                  <span className="text-2xl font-bold text-[#0D5D48]">
                    {totalPrice.toLocaleString()} <span className="text-sm font-medium">ل.س</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                  <Clock className="w-4 h-4" />
                  <span>مدة التوصيل: {service.deliveryTime} أيام</span>
                </div>

                {/* Extras */}
                {service.extras && service.extras.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold text-[#1A1A2E] mb-2">إضافات اختيارية</h4>
                    <div className="space-y-2">
                      {service.extras.map((extra, i) => (
                        <button
                          key={i}
                          onClick={() => toggleExtra(i)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-colors text-sm ${
                            selectedExtras.includes(i)
                              ? "border-[#0D5D48] bg-[#E8F5F0]"
                              : "border-[#E5E5DF] hover:border-[#0D5D48]"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-right">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              selectedExtras.includes(i) ? "bg-[#0D5D48] border-[#0D5D48]" : "border-gray-300"
                            }`}>
                              {selectedExtras.includes(i) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span>{extra.name}</span>
                          </div>
                          <span className="font-semibold text-[#0D5D48]">{extra.price.toLocaleString()} ل.س</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between mb-5">
                  <span className="font-semibold text-[#1A1A2E]">الإجمالي</span>
                  <span className="text-xl font-bold text-[#0D5D48]">
                    {totalPrice.toLocaleString()} ل.س
                  </span>
                </div>

                <Button className="w-full bg-[#0D5D48] hover:bg-[#094533] text-white rounded-xl h-12 text-base font-semibold mb-3 shadow-[0_4px_12px_rgba(13,93,72,0.25)]">
                  اطلب الآن
                </Button>

                <Button variant="outline" className="w-full border-[#0D5D48] text-[#0D5D48] hover:bg-[#E8F5F0] rounded-xl h-12 text-base font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  تواصل مع البائع
                </Button>

                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 justify-center">
                  <Shield className="w-4 h-4 text-[#0D5D48]" />
                  <span>ضمان استعادة الأموال</span>
                </div>
              </div>

              {/* Seller Mini Card */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={seller?.avatar} alt={seller?.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-[#1A1A2E]">{seller?.name}</h4>
                    <p className="text-sm text-gray-500">{seller?.levelLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">{seller?.rating}</span>
                  <span className="text-sm text-gray-500">({seller?.totalOrders} طلب)</span>
                </div>
                <Button variant="outline" className="w-full border-[#0D5D48] text-[#0D5D48] hover:bg-[#E8F5F0] rounded-xl" asChild>
                  <Link to={`/sellers/${seller?.id}`}>عرض الملف الشخصي</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
