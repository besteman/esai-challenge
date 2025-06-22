"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

interface EditableCardProps {
  title: string;
  value: string;
  onEdit: () => void;
  show: boolean;
}

export const EditableCard = ({
  title,
  value,
  onEdit,
  show,
}: EditableCardProps) => {
  if (!show) return null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-sm text-muted-foreground">
              {title}
            </p>
            <p className="text-lg">{value}</p>
          </div>
          <Button color="primary" size="sm" variant="light" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
