"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { ProductWelcome } from "@/components/productWelcome";
import { PromptReq } from "@/components/stream/promptReq";
import { TextInput } from "@/components/question/textInput";
import { FactorSelector } from "@/components/question/factorSelector";
import { EditableCard } from "@/components/summary/editableCard";
import { FactorsCard } from "@/components/summary/factorsCard";
import { MajorOption } from "@/types";

interface UserInputs {
  favoriteSubject: string;
  factors: {
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
  };
  postCollegePlans: string;
}

export default function MajorMentorPage() {
  const [currentStage, setCurrentStage] = useState(1);
  const [userInputs, setUserInputs] = useState<UserInputs>({
    favoriteSubject: "",
    factors: {
      factor1: {
        value: "",
        importance: 1,
      },
      factor2: {
        value: "",
        importance: 1,
      },
      factor3: {
        value: "",
        importance: 1,
      },
    },
    postCollegePlans: "",
  });
  const [generation, setGeneration] = useState("");
  const [starredStates, setStarredStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Function to save data to the database via API
  const saveMajorRecommendation = async (generationResponse: string) => {
    try {
      const response = await fetch("/api/db/postMajorMentor", {
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
      console.error("Error saving major recommendation:", error);
    }
  };

  // Function to toggle starred state for a major recommendation
  const toggleStarred = async (index: number) => {
    const newStarredStates = {
      ...starredStates,
      [index]: !starredStates[index],
    };

    setStarredStates(newStarredStates);

    // Re-save to database with updated starred states
    if (generation) {
      try {
        const response = await fetch("/api/db/postMajorMentor", {
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
          throw new Error(result.error || "Failed to update starred status");
        }

        // eslint-disable-next-line no-console
        console.log("Successfully updated starred status:", result);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error updating starred status:", error);
        // Revert the state change on error
        setStarredStates(starredStates);
      }
    }
  };

  const dropdownOptions = [
    { value: "salary", label: "Salary" },
    { value: "work-life balance", label: "Work-life Balance" },
    { value: "job satisfaction", label: "Job Satisfaction" },
    { value: "helping others", label: "Helping Others" },
    { value: "job security", label: "Job Security" },
  ];

  const handleEditStage = (stage: number) => {
    setCurrentStage(stage);
  };

  const renderPreviousInputs = () => {
    return (
      <div className="w-full max-w-2xl space-y-4 mb-6">
        <EditableCard
          show={currentStage > 1}
          title="Favorite Subject:"
          value={userInputs.favoriteSubject}
          onEdit={() => handleEditStage(1)}
        />

        <FactorsCard
          factors={userInputs.factors}
          show={currentStage > 2}
          onEdit={() => handleEditStage(2)}
        />

        <EditableCard
          show={currentStage > 3}
          title="Post-College Plans:"
          value={userInputs.postCollegePlans}
          onEdit={() => handleEditStage(3)}
        />
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ProductWelcome
        description="Discover the best majors for you! Align your interests, strengths, and goals to find a future that fits."
        heading="Let's find the best major for you."
        subtitle="Picking a major is an exciting step toward your future!"
        title="Major Mentor"
      />

      {renderPreviousInputs()}

      <div className="w-full max-w-2xl">
        {currentStage === 1 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.favoriteSubject}
            label="Favorite Subject"
            placeholder="Tell us about your favorite subject and why you enjoyed it..."
            question="What was your favorite subject in school?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, favoriteSubject: value });
              setCurrentStage(2);
            }}
          />
        )}

        {currentStage === 2 && (
          <FactorSelector
            factors={userInputs.factors}
            options={dropdownOptions}
            question="Select your factors and rate their importance:"
            onSubmit={(factors) => {
              setUserInputs({ ...userInputs, factors });
              setCurrentStage(3);
            }}
          />
        )}

        {currentStage === 3 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.postCollegePlans}
            label="Post-College Plans"
            placeholder="Describe your career goals, further education plans, or other aspirations..."
            question="What are your plans after college?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, postCollegePlans: value });
              setCurrentStage(4);
            }}
          />
        )}

        {currentStage === 4 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Ready to find your perfect major?
            </h3>
            {!generation && (
              <PromptReq
                buttonText="Find Me A Major!"
                loadingSubtext="Finding your perfect major match..."
                loadingText="Loading..."
                systemPrompt={
                  "You are a college admission advisor who is helping a student chosing their possible major in college" +
                  "You will receive the student's inputs in JSON of their favorite subject, 3 things that are important with their importance ratings, and post-college plans." +
                  "You will give 3 possible majors that fit the student's inputs, and a brief summary of each major and why it is a good fit." +
                  "You will return the response in a JSON format of the following structure: " +
                  JSON.stringify([
                    {
                      option1: {
                        majorTitle: "Financial Planning",
                        descriptionOfMajor: "This is what the job is",
                        whyThisMajor:
                          "With your interest in helping others with finances and a high importance placed on job security, a major in finance or financial planning can lead to stable, rewarding careers such as financial advisor, planner, or analyst.",
                      },
                    },
                    {
                      option2: {
                        majorTitle: "Financial Planning",
                        descriptionOfMajor: "This is what the job is",
                        whyThisMajor:
                          "With your interest in helping others with finances and a high importance placed on job security, a major in finance or financial planning can lead to stable, rewarding careers such as financial advisor, planner, or analyst.",
                      },
                    },
                  ])
                }
                userPrompt={`Given the following user inputs: ${JSON.stringify(userInputs)}`}
                onResponse={async (response) => {
                  setGeneration(response);
                  await saveMajorRecommendation(response);
                }}
              />
            )}
            {generation && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center mb-4">
                  Your Recommended Majors:
                </h4>
                <div className="space-y-4">
                  {(() => {
                    try {
                      const parsedGeneration = JSON.parse(generation);

                      return parsedGeneration.map(
                        (item: any, index: number) => {
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
                                      What is this major?
                                    </h5>
                                    <p className="text-sm">
                                      {option.descriptionOfMajor}
                                    </p>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-sm text-muted-foreground mb-1">
                                      Why this major for you?
                                    </h5>
                                    <p className="text-sm">
                                      {option.whyThisMajor}
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
