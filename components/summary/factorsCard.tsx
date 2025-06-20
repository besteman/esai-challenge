"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

interface FactorsData {
  factor1: {
    value: string;
    importance: number;
  };
  factor2: {
    value: string;
    importance: number;
  };
  factor3: {
    value: string;
    importance: number;
  };
}

interface FactorsCardProps {
  factors: FactorsData;
  onEdit: () => void;
  show: boolean;
}

export const FactorsCard = ({ factors, onEdit, show }: FactorsCardProps) => {
  if (!show) return null;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardBody className="p-4" onClick={onEdit}>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="font-semibold text-sm text-muted-foreground">
              Selections & Importance:
            </p>
            <div className="space-y-1">
              <p className="text-sm">
                Factor 1: {factors.factor1.value} (Importance:{" "}
                {factors.factor1.importance}/5)
              </p>
              <p className="text-sm">
                Factor 2: {factors.factor2.value} (Importance:{" "}
                {factors.factor2.importance}/5)
              </p>
              <p className="text-sm">
                Factor 3: {factors.factor3.value} (Importance:{" "}
                {factors.factor3.importance}/5)
              </p>
            </div>
          </div>
          <Button color="primary" size="sm" variant="light">
            Edit
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
