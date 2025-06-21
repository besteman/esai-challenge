import { Card, CardBody } from "@heroui/card";

interface ProductWelcomeProps {
  title: string;
  description: string;
  heading: string;
  subtitle: string;
}

export const ProductWelcome = ({
  title,
  description,
  heading,
  subtitle,
}: ProductWelcomeProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground mb-6">{description}</p>
      <Card>
        <CardBody>
          <p>{heading}</p>
          <p>{subtitle}</p>
        </CardBody>
      </Card>
    </div>
  );
};
