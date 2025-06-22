"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { ProductWelcome } from "@/components/productWelcome";
import { PromptReq } from "@/components/stream/promptReq";
import { TextInput } from "@/components/question/textInput";
import { EditableCard } from "@/components/summary/editableCard";
import { schoolMatchPrompt } from "@/lib/prompts";
import { SchoolMatchOption } from "@/types";

interface UserInputs {
  location: string;
  locationRequirements: string;
  futurePlans: string;
  idealCampusExperience: string;
  unweightedGPA: string;
}

export default function SchoolMatchPage() {
  const [currentStage, setCurrentStage] = useState(1);
  const [userInputs, setUserInputs] = useState<UserInputs>({
    location: "",
    locationRequirements: "",
    futurePlans: "",
    idealCampusExperience: "",
    unweightedGPA: "",
  });
  const [generation, setGeneration] = useState("");
  const [starredStates, setStarredStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Function to toggle starred state for a college recommendation
  const toggleStarred = async (index: number) => {
    // Update local state immediately for instant UI feedback
    const newStarredStates = {
      ...starredStates,
      [index]: !starredStates[index],
    };

    setStarredStates(newStarredStates);

    // Persist the change to the backend if we have a generation to save
    if (generation) {
      try {
        const response = await fetch("/api/db/postSchoolMatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInputs,
            generationResponse: generation,
            starredStates: newStarredStates,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to save starred state");
        }

        // eslint-disable-next-line no-console
        console.log("Successfully updated starred state:", result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error updating starred state:", error);

        // Revert the local state change if the API call failed
        setStarredStates({
          ...starredStates,
          [index]: starredStates[index],
        });
      }
    }
  };

  // Function to save data to the database via API
  const saveSchoolRecommendation = async (generationResponse: string) => {
    try {
      const response = await fetch("/api/db/postSchoolMatch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInputs,
          generationResponse,
          starredStates,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save data");
      }

      // eslint-disable-next-line no-console
      console.log("Successfully saved:", result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error saving school recommendation:", error);
    }
  };

  const handleEditStage = (stage: number) => {
    setCurrentStage(stage);
  };

  const renderPreviousInputs = () => {
    return (
      <div className="w-full max-w-2xl space-y-4 mb-6">
        <EditableCard
          show={currentStage > 1}
          title="Location"
          value={userInputs.location}
          onEdit={() => handleEditStage(1)}
        />

        <EditableCard
          show={currentStage > 2}
          title="Location Requirements:"
          value={userInputs.locationRequirements}
          onEdit={() => handleEditStage(2)}
        />

        <EditableCard
          show={currentStage > 3}
          title="Future Plans:"
          value={userInputs.futurePlans}
          onEdit={() => handleEditStage(3)}
        />

        <EditableCard
          show={currentStage > 4}
          title="Ideal Campus Experience:"
          value={userInputs.idealCampusExperience}
          onEdit={() => handleEditStage(4)}
        />

        <EditableCard
          show={currentStage > 5}
          title="Unweighted GPA:"
          value={userInputs.unweightedGPA}
          onEdit={() => handleEditStage(5)}
        />
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ProductWelcome
        description="Find the best schools and programs for you based on your strengths, goals, and budget."
        heading="Let's make you a match!"
        subtitle="Congrats on beginning the process of finding your dream school."
        title="School Match Maker"
      />

      {renderPreviousInputs()}

      <div className="w-full max-w-2xl">
        {currentStage === 1 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.location}
            label="Location"
            placeholder="example: Florida"
            question="If you live in the United States, what state do you live in?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, location: value });
              setCurrentStage(2);
            }}
          />
        )}

        {currentStage === 2 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.locationRequirements}
            label="Location Requirements"
            placeholder="example: I want to have the access to best ramen"
            question="Do you have any other location requirements?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, locationRequirements: value });
              setCurrentStage(3);
            }}
          />
        )}

        {currentStage === 3 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.futurePlans}
            label="Future Plans"
            placeholder="Tell us about your future major or career goals"
            question="What are your plans after college?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, futurePlans: value });
              setCurrentStage(4);
            }}
          />
        )}

        {currentStage === 4 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.idealCampusExperience}
            label="Ideal Campus Experience"
            placeholder="Smaller campus, more community, etc."
            question="Describe your ideal campus experience."
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, idealCampusExperience: value });
              setCurrentStage(5);
            }}
          />
        )}

        {currentStage === 5 && (
          <TextInput
            buttonText="Next"
            disableWordCount={true}
            initialValue={userInputs.unweightedGPA}
            label="Unweighted GPA"
            placeholder="example: 3.5"
            question="What is your unweighted GPA?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, unweightedGPA: value });
              setCurrentStage(6);
            }}
          />
        )}

        {currentStage === 6 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Ready to find your perfect College?
            </h3>
            {!generation && (
              <PromptReq
                buttonText="Find Me A College!"
                loadingSubtext="Finding your perfect college match..."
                loadingText="Loading..."
                systemPrompt={schoolMatchPrompt.complete}
                userPrompt={`Given the following user inputs: ${JSON.stringify(userInputs)}`}
                onResponse={async (response) => {
                  setGeneration(response);
                  await saveSchoolRecommendation(response);
                }}
              />
            )}
            {generation && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center mb-4">
                  Your Recommended College Recommendations:
                </h4>
                <div className="space-y-4">
                  {(() => {
                    try {
                      const parsedGeneration = JSON.parse(generation);

                      return parsedGeneration.map(
                        (item: any, index: number) => {
                          const optionKey = Object.keys(item)[0];
                          const option: SchoolMatchOption = item[optionKey];

                          return (
                            <Card key={index} className="w-full relative">
                              <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                                <div className="flex justify-between items-start w-full">
                                  <h4 className="font-bold text-large text-primary">
                                    {option.collegeName}
                                  </h4>
                                  <button
                                    className="text-2xl hover:scale-110 transition-transform"
                                    type="button"
                                    onClick={() => toggleStarred(index)}
                                  >
                                    {starredStates[index] ? "⭐" : "☆"}
                                  </button>
                                </div>
                              </CardHeader>
                              <CardBody className="overflow-visible py-2 px-4">
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Description of College
                                    </h5>
                                    <p className="text-sm">
                                      {option.descriptionOfCollege}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Why This College:
                                    </h5>
                                    <p className="text-sm">
                                      {option.whyThisCollege}
                                    </p>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          );
                        },
                      );
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
                            <div className="whitespace-pre-wrap">
                              {generation}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
