"use client";

import { Card } from "@heroui/card";
import Link from "next/link";

import { ElevatedButton } from "./elevatedButton";

interface ProductCardsProps {
  title: string;
  description: string;
  href: string;
  image?: string;
}

export const ProductCard = ({
  title,
  description,
  href,
  image,
}: ProductCardsProps) => {
  const backgroundImage =
    image || "https://heroui.com/images/hero-card-complete.jpeg";

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 relative overflow-hidden"
      style={{
        width: "320px",
        height: "320px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 bg-opacity-50 w-full h-full flex flex-col justify-between items-center p-4 pt-8 pb-6 text-center">
        <div>
          <h2 className="font-bold text-xl mb-2" style={{ color: "#231651" }}>
            {title}
          </h2>
          <p
            className="text-small break-words font-bold whitespace-normal opacity-90"
            style={{ color: "#231651" }}
          >
            {description}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href={href}>
            <ElevatedButton>Start</ElevatedButton>
          </Link>
        </div>
      </div>
    </Card>
  );
};
