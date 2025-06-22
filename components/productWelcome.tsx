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
      <h1 className="text-center mb-5 text-3xl sm:text-md md:text-3xl lg:text-4xl xl:text-6xl font-bold">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground mb-6">{description}</p>
      <Card
        style={{ outline: "5px solid #231651", backgroundColor: "#D99830" }}
      >
        <CardBody>
          <p>{heading}</p>
          <p>{subtitle}</p>
        </CardBody>
      </Card>
    </div>
  );
};
