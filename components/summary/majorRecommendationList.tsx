import { Card, CardBody, CardHeader } from "@heroui/card";

import { MajorOption } from "@/types";

interface MajorRecommendationListProps {
  generation: string;
  starredStates: { [key: number]: boolean };
  onToggleStarred: (index: number) => void;
}

export function MajorRecommendationList({
  generation,
  starredStates,
  onToggleStarred,
}: MajorRecommendationListProps) {
  return (
    <div className="space-y-4">
      {(() => {
        try {
          const parsedGeneration = JSON.parse(generation);

          return parsedGeneration.map((item: any, index: number) => {
            const optionKey = Object.keys(item)[0];
            const option: MajorOption = item[optionKey];

            return (
              <Card key={index} className="w-full relative">
                <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                  <div className="flex justify-between items-start w-full">
                    <h4 className="font-bold text-large text-primary">
                      {option.majorTitle}
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
                      <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                        What is this major?
                      </h5>
                      <p className="text-sm">{option.descriptionOfMajor}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                        Why this major for you?
                      </h5>
                      <p className="text-sm">{option.whyThisMajor}</p>
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
                  The response couldn&apos;t be parsed as expected. Here&apos;s
                  the raw response:
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
  );
}
