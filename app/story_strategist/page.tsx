import { title, subtitle } from "@/components/primitives";

export default function StoryStrategistPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>Story Strategist</h1>
        <p className={subtitle()}>What is your story?</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-lg">
          Welcome to Story Strategist! Craft and refine your personal narrative
          to make a lasting impression.
        </p>
      </div>
    </section>
  );
}
