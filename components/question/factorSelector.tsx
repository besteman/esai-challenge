"use client";

import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";

import { ElevatedButton } from "../elevatedButton";

interface FactorSelection {
  value: string;
  importance: number;
}

interface SelectionOption {
  value: string;
  label: string;
}

interface FactorSelectorProps {
  question: string;
  factors: {
    factor1: FactorSelection;
    factor2: FactorSelection;
    factor3: FactorSelection;
  };
  options: SelectionOption[];
  buttonText?: string;
  onSubmit: (factors: {
    factor1: FactorSelection;
    factor2: FactorSelection;
    factor3: FactorSelection;
  }) => void;
  disabled?: boolean;
}

export const FactorSelector = ({
  question,
  factors,
  options,
  buttonText = "Next",
  onSubmit,
  disabled = false,
}: FactorSelectorProps) => {
  const [localFactors, setLocalFactors] = useState(factors);

  const handleFactorChange = (
    factorKey: "factor1" | "factor2" | "factor3",
    value: string,
  ) => {
    setLocalFactors((prev) => ({
      ...prev,
      [factorKey]: {
        ...prev[factorKey],
        value,
      },
    }));
  };

  const handleImportanceChange = (
    factorKey: "factor1" | "factor2" | "factor3",
    importance: number | number[],
  ) => {
    const importanceValue = Array.isArray(importance)
      ? importance[0]
      : importance;

    setLocalFactors((prev) => ({
      ...prev,
      [factorKey]: {
        ...prev[factorKey],
        importance: importanceValue,
      },
    }));
  };

  const handleSubmit = () => {
    if (
      localFactors.factor1.value &&
      localFactors.factor2.value &&
      localFactors.factor3.value
    ) {
      onSubmit(localFactors);
    }
  };

  const isSubmitDisabled =
    disabled ||
    !localFactors.factor1.value ||
    !localFactors.factor2.value ||
    !localFactors.factor3.value;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-center">{question}</h3>
      <div className="space-y-6">
        {/* Factor 1 */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Factor 1</div>
          <Select
            className="w-full"
            placeholder="Select an option"
            selectedKeys={
              localFactors.factor1.value
                ? new Set([localFactors.factor1.value])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;

              handleFactorChange("factor1", selectedKey || "");
            }}
          >
            {options.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Importance: {localFactors.factor1.importance}/5
            </div>
            <Slider
              className="w-full"
              maxValue={5}
              minValue={1}
              step={1}
              value={localFactors.factor1.importance}
              onChange={(value) => handleImportanceChange("factor1", value)}
            />
          </div>
        </div>

        {/* Factor 2 */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Factor 2</div>
          <Select
            className="w-full"
            placeholder="Select an option"
            selectedKeys={
              localFactors.factor2.value
                ? new Set([localFactors.factor2.value])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;

              handleFactorChange("factor2", selectedKey || "");
            }}
          >
            {options.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Importance: {localFactors.factor2.importance}/5
            </div>
            <Slider
              className="w-full"
              maxValue={5}
              minValue={1}
              step={1}
              value={localFactors.factor2.importance}
              onChange={(value) => handleImportanceChange("factor2", value)}
            />
          </div>
        </div>

        {/* Factor 3 */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Factor 3</div>
          <Select
            className="w-full"
            placeholder="Select an option"
            selectedKeys={
              localFactors.factor3.value
                ? new Set([localFactors.factor3.value])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;

              handleFactorChange("factor3", selectedKey || "");
            }}
          >
            {options.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Importance: {localFactors.factor3.importance}/5
            </div>
            <Slider
              className="w-full"
              maxValue={5}
              minValue={1}
              step={1}
              value={localFactors.factor3.importance}
              onChange={(value) => handleImportanceChange("factor3", value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <ElevatedButton disabled={isSubmitDisabled} onClick={handleSubmit}>
          {buttonText}
        </ElevatedButton>
      </div>
    </div>
  );
};
