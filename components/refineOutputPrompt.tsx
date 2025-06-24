"use client";

import { useState } from "react";
import { Input } from "@heroui/input";

import { ElevatedButton } from "@/components/elevatedButton";

interface RefineOutputPromptProps {
  buttonOptions?: string[];
  onRefine?: (refinementText: string) => void;
}

export function RefineOutputPrompt({
  buttonOptions = [
    "Add more career details",
    "Include salary information",
    "Show internship opportunities",
  ],
  onRefine,
}: RefineOutputPromptProps) {
  const [inputValue, setInputValue] = useState("");

  const handleButtonClick = (buttonText: string) => {
    setInputValue(buttonText);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleRefine = () => {
    if (inputValue.trim() && onRefine) {
      onRefine(inputValue.trim());
    }
  };

  return (
    <div className="space-y-4">
      <h5 className="text-lg font-semibold text-center">
        Want to refine your results?
      </h5>
      <p className="text-sm text-muted-foreground text-center">
        Click a suggestion below or type your own refinement request:
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {buttonOptions.map((option, index) => (
          <ElevatedButton
            key={index}
            className="text-sm"
            onClick={() => handleButtonClick(option)}
          >
            {option}
          </ElevatedButton>
        ))}
      </div>

      <div className="space-y-3">
        <Input
          className="w-full"
          label="Refinement Request"
          placeholder="Enter your refinement request..."
          value={inputValue}
          variant="bordered"
          onChange={(e) => handleInputChange(e.target.value)}
        />

        <div className="flex justify-center">
          <ElevatedButton disabled={!inputValue.trim()} onClick={handleRefine}>
            Refine Results
          </ElevatedButton>
        </div>
      </div>
    </div>
  );
}
