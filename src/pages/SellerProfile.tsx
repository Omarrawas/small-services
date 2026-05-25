import { useParams, Link } from "react-router";
import { Star, Clock, MessageCircle, ShoppingBag, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServiceCard from "@/components/cards/ServiceCard";
import { sellers, services, reviews } from "@/lib/mockData";

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>();
  const seller = sellers.find((s) => s.id === parseInt(id || "0"));

  if (!seller) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 text-center py-20">
          <p className="text-xl text-gray-500">البائع غير موجود</p>
          <Button asChild className="mt-4 bg-[#0D5D48]">
            <Link to="/services">العودة للخدمات</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const sellerServices = services.filter((s) => s.sellerId === seller.id);
  const sellerReviews = reviews.filter((r) => r.revieweeId === seller.id);
  const rtHours = Math.floor((seller.responseTime || 60) / 60);
  const rtLabel = rtHours > 0 ? `< ${rtHours + 1} ساعة` : `< ${seller.responseTime} دقيقة`;

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />

      {/* Seller Header */}
      <section
        className="pt-[72px] py-12"
        style={{ background: "linear-gradient(135deg, #0D5D48 0%, #094533 100%)" }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="text-center sm:text-right flex-1">
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                <h1 className="text-white text-3xl font-bold">{seller.name}</h1>
                <span className="text-xs bg-[#C49A2C] text-white px-3 py-1 rounded-full">{seller.levelLabel}</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-xl mb-4">{seller.bio}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-white text-sm">
                <div className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{seller.totalOrders} طلب</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{seller.rating} تقييم</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>100% استجابة</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{rtLabel}</span>
                </div>
              </div>
            </div>
            <Button className="bg-white text-[#0D5D48] hover:bg-gray-100 rounded-xl px-6 h-11 font-semibold shrink-0">
              <MessageCircle className="w-4 h-4 ml-2" />
              تواصل
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <Tabs defaultValue="services">
          <TabsList className="bg-white border border-[#E5E5DF] rounded-xl p-1 h-auto mb-6">
            <TabsTrigger value="services" className="rounded-lg px-5 py-2 data-[state=active]:bg-[#E8F5F0] data-[state=active]:text-[#0D5D48]">
              الخدمات ({sellerServices.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg px-5 py-2 data-[state=active]:bg-[#E8F5F0] data-[state=active]:text-[#0D5D48]">
              التقييمات ({sellerReviews.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg px-5 py-2 data-[state=active]:bg-[#E8F5F0] data-[state=active]:text-[#0D5D48]">
              معلومات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            {sellerServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    sellerId={service.sellerId}
                    title={service.title}
                    slug={service.slug}
                    price={service.price}
                    images={service.images}
                    rating={service.rating}
                    totalReviews={service.totalReviews}
                    featured={service.featured}
                    deliveryTime={service.deliveryTime}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">لا توجد خدمات بعد</p>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              {sellerReviews.length > 0 ? (
                <div className="space-y-5">
                  {sellerReviews.map((review) => (
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
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">{review.serviceTitle}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">لا توجد تقييمات بعد</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <h3 className="text-[#1A1A2E] font-bold text-xl mb-4">نبذة عن البائع</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{seller.bio}</p>

              <h4 className="text-[#1A1A2E] font-semibold mb-3">المهارات</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {["تصميم", "فوتوشوب", "إليستريتور", "UI/UX"].map((skill, i) => (
                  <Badge key={i} variant="secondary" className="rounded-full px-3 py-1">{skill}</Badge>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[#FAFBF7] rounded-xl">
                  <p className="text-2xl font-bold text-[#0D5D48]">{seller.totalOrders}</p>
                  <p className="text-sm text-gray-500">إجمالي الطلبات</p>
                </div>
                <div className="text-center p-4 bg-[#FAFBF7] rounded-xl">
                  <p className="text-2xl font-bold text-[#0D5D48]">{seller.completedOrders}</p>
                  <p className="text-sm text-gray-500">طلب مكتمل</p>
                </div>
                <div className="text-center p-4 bg-[#FAFBF7] rounded-xl">
                  <p className="text-2xl font-bold text-[#0D5D48]">{seller.rating}</p>
                  <p className="text-sm text-gray-500">متوسط التقييم</p>
                </div>
                <div className="text-center p-4 bg-[#FAFBF7] rounded-xl">
                  <p className="text-2xl font-bold text-[#0D5D48]">{rtLabel}</p>
                  <p className="text-sm text-gray-500">سرعة الاستجابة</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
