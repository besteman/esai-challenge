import { title, subtitle } from "@/components/primitives";

export default function MajorMentorPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Major Mentor</h1>
        <p className={subtitle()}>
          What is your major? Let&apos;s find out together!
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-lg">
          Welcome to Major Mentor! Discover the perfect academic path that
          aligns with your interests and career goals.
        </p>
      </div>
    </section>
  );
}
