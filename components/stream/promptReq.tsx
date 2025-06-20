"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { openai } from "@ai-sdk/openai";

interface PromptReqProps {
  buttonText?: string;
  buttonColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  buttonSize?: "sm" | "md" | "lg";
  systemPrompt: string;
  userPrompt: string;
  onResponse: (response: string) => void;
  onLoading?: (isLoading: boolean) => void;
  disabled?: boolean;
  loadingText?: string;
  loadingSubtext?: string;
}

export const PromptReq = ({
  buttonText = "Submit",
  buttonColor = "primary",
  buttonSize = "md",
  systemPrompt,
  userPrompt,
  onResponse,
  onLoading,
  disabled = false,
  loadingText = "Loading...",
  loadingSubtext,
}: PromptReqProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    onLoading?.(true);

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        body: JSON.stringify({
          system: systemPrompt,
          model: openai("gpt-3.5-turbo"),
          prompt: userPrompt,
        }),
      });

      const json = await response.json();

      onResponse(json.text);
    } catch (error) {
      onResponse(
        `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
      );
    } finally {
      setIsLoading(false);
      onLoading?.(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-lg">{loadingText}</div>
        {loadingSubtext && (
          <div className="text-sm text-muted-foreground">{loadingSubtext}</div>
        )}
      </div>
    );
  }

  return (
    <Button
      color={buttonColor}
      isDisabled={disabled}
      size={buttonSize}
      onClick={handleSubmit}
    >
      {buttonText}
    </Button>
  );
};
