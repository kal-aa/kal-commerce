import Testimonial from "@/components/Testimonial";
import MainLogic from "@/components/MainLogic";

export default function HomePage() {
  return (
    <div className="min-h-[55vh] mt-28">
      <MainLogic isAddOrdersPage={false} query="" />
      <Testimonial />
    </div>
  );
}
