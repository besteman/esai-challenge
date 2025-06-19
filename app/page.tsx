import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { ProductCard } from "@/components/productCards";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>{siteConfig.name}</h1>
        <p className={subtitle()}>{siteConfig.description}</p>
      </div>
      <div className="flex flex-row gap-4 justify-center items-start flex-wrap">
        <ProductCard
          description="Lets see where the sorting hat puts you."
          href="/school_match"
          title="School Match Maker"
        />
        <ProductCard
          description="What is your major? Lets find out together!"
          href="/major_mentor"
          title="Major Mentor"
        />
        <ProductCard
          description="What is your story?"
          href="/story_strategist"
          title="Story Strategist"
        />
      </div>
    </section>
  );
}
