import { ProductWelcome } from "@/components/productWelcome";

export default function SchoolMatchPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ProductWelcome
        description="Find the best schools and programs for you based on your strengths, goals, and budget."
        heading="Let's find your perfect school match."
        subtitle="Discover schools that align with your aspirations and values!"
        title="School Match Maker"
      />
    </section>
  );
}
