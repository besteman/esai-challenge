import { title, subtitle } from "@/components/primitives";

export default function SchoolMatchPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={title()}>School Match Maker</h1>
        <p className={subtitle()}>
          Dream school anyone?! Let&apos;s see where the sorting hat puts you.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-lg">
          Welcome to the School Match Maker! This is where you&apos;ll discover
          your perfect educational match.
        </p>
      </div>
    </section>
  );
}
