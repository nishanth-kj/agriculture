import Link from "next/link";
import Hero from "@/components/Hero/Hero";
import Mission from "@/components/Mission/Mission";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Footer from "@/components/Footer/Footer";

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
