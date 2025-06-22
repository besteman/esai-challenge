import { siteConfig } from "@/config/site";
import { ProductCard } from "@/components/productCards";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex justify-center items-center w-full">
        <h1 className="text-center mb-5 text-3xl sm:text-md md:text-3xl lg:text-4xl xl:text-5xl font-bold">
          {siteConfig.description}
        </h1>
      </div>
      <div className="flex flex-row gap-4 justify-center items-start flex-wrap">
        <ProductCard href="/school_match" image="/Match-Maker.png" />
        <ProductCard href="/major_mentor" image="/Major-Mentor.png" />
        <ProductCard href="/story_strategist" image="Story-Strategist.png" />
      </div>
    </section>
  );
}
