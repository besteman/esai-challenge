"use client";

import { Card } from "@heroui/card";
import Link from "next/link";

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
    <Link href={href}>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 relative overflow-hidden"
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
            <button className="relative" type="button">
              <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black" />
              <span
                className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-10 py-1 text-base font-bold text-black transition duration-100 hover:text-gray-900"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#81F495")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                Start
              </span>
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};
