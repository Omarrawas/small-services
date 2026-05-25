import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import ServiceCard from "@/components/cards/ServiceCard";
import { services } from "@/lib/mockData";

export default function FeaturedServices() {
  const featured = services.filter((s) => s.featured);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-[#1A1A2E] text-3xl font-bold">خدمات مميزة</h2>
          <Link
            to="/services"
            className="text-[#0D5D48] font-medium text-sm hover:text-[#094533] transition-colors flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((service, i) => (
            <div
              key={service.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
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
      </div>
    </section>
  );
}
