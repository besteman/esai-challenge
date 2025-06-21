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
  disableWordCount?: boolean;
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
  disableWordCount = false,
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const validateInput = (input: string) => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return "Input cannot be blank";
    }

    // Skip word count validation if disabled
    if (disableWordCount) {
      return "";
    }

    const wordCount = trimmedInput.split(/\s+/).length;

    if (wordCount < 20) {
      return "Input must be at least 20 words";
    }
    if (wordCount > 50) {
      return "Input cannot exceed 50 words";
    }

    return "";
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = () => {
    const validationError = validateInput(value);

    if (!validationError) {
      onSubmit(value);
    } else {
      setError(validationError);
    }
  };

  // Calculate word count for display
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const hasError = !!error;
  const isSubmitDisabled = disabled || !!validateInput(value);
  const meetsMinimum = wordCount >= 20;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">{question}</h3>
      <div className="space-y-2">
        <Textarea
          className="w-full"
          description={
            disableWordCount ? undefined : (
              <span>
                {wordCount}/50 words (
                <span
                  className={meetsMinimum ? "text-green-600" : "text-gray-500"}
                >
                  minimum 20
                </span>
                )
              </span>
            )
          }
          errorMessage={error}
          isInvalid={hasError}
          label={label}
          placeholder={placeholder}
          value={value}
          onValueChange={handleValueChange}
        />
      </div>
      <div className="flex justify-center">
        <Button
          color={buttonColor}
          isDisabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
