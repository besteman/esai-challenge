"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

interface SummaryOption {
  title: string;
  summary: string;
}

interface StoryStrategistRecommendationListProps {
  generation: string;
  starredStates: { [key: number]: boolean };
  onToggleStarred: (index: number) => void;
}

export function StoryStrategistRecommendationList({
  generation,
  starredStates,
  onToggleStarred,
}: StoryStrategistRecommendationListProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-center mb-4">
        Your Recommended Story Angles:
      </h4>
      <div className="space-y-4">
        {(() => {
          try {
            const parsedGeneration = JSON.parse(generation);

            return parsedGeneration.map((item: any, index: number) => {
              const optionKey = Object.keys(item)[0];
              const option: SummaryOption = item[optionKey];

              return (
                <Card key={index} className="w-full">
                  <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                    <div className="flex justify-between items-start w-full">
                      <h4 className="font-bold text-large text-primary">
                        {option.title}
                      </h4>
                      <button
                        className="text-2xl hover:scale-110 transition-transform"
                        type="button"
                        onClick={() => onToggleStarred(index)}
                      >
                        {starredStates[index] ? "⭐" : "☆"}
                      </button>
                    </div>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2 px-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm">{option.summary}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            });
          } catch {
            return (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-red-600 mb-2">
                    Error parsing response
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The response couldn&apos;t be parsed as expected.
                    Here&apos;s the raw response:
                  </p>
                </div>
                <div className="text-left bg-black text-white p-6 rounded-lg">
                  <div className="whitespace-pre-wrap">{generation}</div>
                </div>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}
