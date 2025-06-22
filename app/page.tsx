import { siteConfig } from "@/config/site";
import { ProductCard } from "@/components/productCards";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex justify-center items-center w-full">
        <h1 className="text-center mb-5 text-lg sm:text-md md:text-2xl lg:text-3xl xl:text-4xl">
          {siteConfig.description}
        </h1>
      </div>
      <div className="flex flex-row gap-4 justify-center items-start flex-wrap">
        <ProductCard
          description="Lets see where the sorting hat puts you."
          href="/school_match"
          image="/Light-Bulb.png"
          title="School Match Maker"
        />
        <ProductCard
          description="What is your major? Lets find out together!"
          href="/major_mentor"
          image="/Neon-Books.png"
          title="Major Mentor"
        />
        <ProductCard
          description="What is your story?"
          href="/story_strategist"
          image="/Graduation-Cap.png"
          title="Story Strategist"
        />
      </div>
    </section>
  );
}
