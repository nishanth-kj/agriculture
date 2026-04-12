import Hero from "@/components/home/Hero/Hero";
import Mission from "@/components/home/Mission/Mission";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import Footer from "@/components/home/Footer/Footer";

function page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Mission />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default page;
