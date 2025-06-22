"use client";

import Link from "next/link";

import { ElevatedButton } from "./elevatedButton";

interface ProductCardsProps {
  href: string;
  image?: string;
}

export const ProductCard = ({ href, image }: ProductCardsProps) => {
  const backgroundImage =
    image || "https://heroui.com/images/hero-card-complete.jpeg";

  return (
    <div
      className="relative z-10 bg-opacity-0 w-full h-full flex flex-col justify-end items-center p-4 pt-8 pb-10 text-center"
      style={{
        width: "320px",
        height: "320px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-wrap justify-center gap-6">
        <Link href={href}>
          <ElevatedButton>Start</ElevatedButton>
        </Link>
      </div>
    </div>
  );
};
