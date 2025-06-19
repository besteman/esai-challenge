import { ProductWelcome } from "@/components/productWelcome";

export default function StoryStrategistPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ProductWelcome
        description="Discover what makes your story unique and turn it into a clear, powerful college application narrative."
        heading="Let's craft your unique story."
        subtitle="Your story is your strength. Let's make it shine!"
        title="Story Strategist"
      />
    </section>
  );
}
