import { Card, CardHeader, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import Link from "next/link";

interface ProductCardsProps {
  title: string;
  description: string;
  href: string;
}

export const ProductCard = ({
  title,
  description,
  href,
}: ProductCardsProps) => {
  return (
    <Link href={href}>
      <Card className="py-4 max-w-xs cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">{title}</h4>
          <p className="text-muted-foreground text-small break-words whitespace-normal">
            {description}
          </p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src="https://heroui.com/images/hero-card-complete.jpeg"
            width={270}
          />
        </CardBody>
      </Card>
    </Link>
  );
};
