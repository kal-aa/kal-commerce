import LazyTestimonial from "@/components/HomePage/LazyTestimonial";
import ProductsLogicHandler from "@/components/ProductsLogicHandler";

export default function HomePage() {
  return (
    <div className="min-h-[55vh] mt-28">
      <ProductsLogicHandler isAddOrdersPage={false} query="" />
      <LazyTestimonial />
    </div>
  );
}
