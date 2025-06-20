"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";

interface TextInputProps {
  question: string;
  label: string;
  placeholder: string;
  buttonText?: string;
  buttonColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  initialValue?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export const TextInput = ({
  question,
  label,
  placeholder,
  buttonText = "Next",
  buttonColor = "primary",
  initialValue = "",
  onSubmit,
  disabled = false,
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">{question}</h3>
      <Textarea
        className="w-full"
        label={label}
        placeholder={placeholder}
        value={value}
        onValueChange={setValue}
      />
      <div className="flex justify-center">
        <Button
          color={buttonColor}
          isDisabled={disabled || !value.trim()}
          onClick={handleSubmit}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
