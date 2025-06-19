import { ProductWelcome } from "@/components/productWelcome";

export default function MajorMentorPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ProductWelcome
        description="Discover the best majors for you! Align your interests, strengths, and goals to find a future that fits."
        heading="Let's find the best major for you."
        subtitle="Picking a major is an exciting step toward your future!"
        title="Major Mentor"
      />
    </section>
  );
}
