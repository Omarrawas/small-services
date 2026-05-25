import SellerCard from "@/components/cards/SellerCard";
import { sellers } from "@/lib/mockData";

export default function TopSellers() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-[#1A1A2E] text-3xl font-bold">أفضل البائعين</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller, i) => (
            <div
              key={seller.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <SellerCard
                id={seller.id}
                name={seller.name}
                avatar={seller.avatar}
                levelLabel={seller.levelLabel}
                rating={seller.rating}
                totalOrders={seller.totalOrders}
                responseTime={seller.responseTime}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
