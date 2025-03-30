import MainLogic from "@/components/MainLogic";
import Testimonial from "@/components/Testimonial";

export default async function HomePage() {
  return (
    <div className="min-h-[55vh] mt-28">
      <MainLogic isAddOrdersPage={false} />
      <Testimonial />
    </div>
  );
}
