import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, SlidersHorizontal, Grid3X3, List, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ServiceCard from "@/components/cards/ServiceCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { services, categories } from "@/lib/mockData";

export default function Services() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q) || s.tags?.some((t) => t.toLowerCase().includes(q)));
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((s) => s.categoryId === cat.id);
      }
    }

    if (minPrice) result = result.filter((s) => parseFloat(s.price) >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((s) => parseFloat(s.price) <= parseFloat(maxPrice));
    if (minRating > 0) result = result.filter((s) => parseFloat(s.rating) >= minRating);

    if (sortBy === "popular") result.sort((a, b) => b.totalOrders - a.totalOrders);
    else if (sortBy === "newest") result.sort((a, b) => b.id - a.id);
    else if (sortBy === "rating") result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortBy === "price_asc") result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    else if (sortBy === "price_desc") result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    return result;
  }, [query, selectedCategory, minPrice, maxPrice, minRating, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
  };

  const activeFiltersCount = [
    query, selectedCategory, minPrice, maxPrice, minRating > 0
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAFBF7]">
      <Header />

      {/* Page Header */}
      <div className="bg-[#E8F5F0] py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>الرئيسية</span>
            <span>/</span>
            <span className="text-[#0D5D48]">الخدمات</span>
          </div>
          <h1 className="text-[#1A1A2E] text-3xl font-bold mb-2">تصفح الخدمات</h1>
          <p className="text-gray-500 text-base">اكتشف آلاف الخدمات الرقمية من أفضل البائعين</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-[#1A1A2E]">الفلاتر</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-red-500 text-sm hover:underline">
                    مسح الكل
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث في الخدمات..."
                    className="pr-10 text-sm h-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-[#1A1A2E] mb-3">التصنيفات</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-[#E8F5F0] text-[#0D5D48] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat.nameAr}</span>
                      <span className="text-xs text-gray-400">{cat.serviceCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-[#1A1A2E] mb-3">نطاق السعر</h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="من"
                    className="text-sm h-10"
                  />
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="إلى"
                    className="text-sm h-10"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-[#1A1A2E] mb-3">التقييم</h4>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        minRating === rating
                          ? "bg-[#E8F5F0] text-[#0D5D48] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span>{rating}+ نجوم</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-gray-500">
                نتائج البحث: <span className="font-semibold text-[#1A1A2E]">{filteredServices.length}</span> خدمة
              </p>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  className="lg:hidden h-10 gap-2"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  فلاتر
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-[#0D5D48] text-white text-xs w-5 h-5 p-0 flex items-center justify-center rounded-full">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-[#E5E5DF] bg-white text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#0D5D48]"
                >
                  <option value="popular">الأكثر مبيعاً</option>
                  <option value="newest">الأحدث</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="price_asc">السعر: من الأقل</option>
                  <option value="price_desc">السعر: من الأعلى</option>
                </select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border border-[#E5E5DF] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 ${viewMode === "grid" ? "bg-[#E8F5F0] text-[#0D5D48]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 ${viewMode === "list" ? "bg-[#E8F5F0] text-[#0D5D48]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {query && (
                  <Badge variant="secondary" className="gap-1">
                    بحث: {query}
                    <button onClick={() => setQuery("")}><X className="w-3 h-3" /></button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find((c) => c.slug === selectedCategory)?.nameAr}
                    <button onClick={() => setSelectedCategory("")}><X className="w-3 h-3" /></button>
                  </Badge>
                )}
                {minPrice && (
                  <Badge variant="secondary" className="gap-1">
                    من {minPrice} ل.س
                    <button onClick={() => setMinPrice("")}><X className="w-3 h-3" /></button>
                  </Badge>
                )}
                {maxPrice && (
                  <Badge variant="secondary" className="gap-1">
                    إلى {maxPrice} ل.س
                    <button onClick={() => setMaxPrice("")}><X className="w-3 h-3" /></button>
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {minRating}+ نجوم
                    <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                  </Badge>
                )}
              </div>
            )}

            {/* Grid/List */}
            {filteredServices.length > 0 ? (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {filteredServices.map((service, i) => (
                  <div
                    key={service.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(i * 0.06, 0.5)}s`, opacity: 0 }}
                  >
                    <ServiceCard
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-2">لا توجد خدمات مطابقة للبحث</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  مسح الفلاتر
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div
            className="absolute top-0 right-0 w-80 max-w-full h-full bg-white overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#1A1A2E]">الفلاتر</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-5">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث في الخدمات..."
                  className="pr-10 text-sm h-10"
                />
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold text-[#1A1A2E] mb-3">التصنيفات</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-[#E8F5F0] text-[#0D5D48] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.nameAr}</span>
                    <span className="text-xs text-gray-400">{cat.serviceCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold text-[#1A1A2E] mb-3">نطاق السعر</h4>
              <div className="flex gap-2">
                <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="من" className="text-sm h-10" />
                <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="إلى" className="text-sm h-10" />
              </div>
            </div>

            <Button className="w-full bg-[#0D5D48] hover:bg-[#094533] rounded-xl" onClick={() => setMobileFiltersOpen(false)}>
              تطبيق الفلاتر
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
