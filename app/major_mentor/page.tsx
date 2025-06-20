"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { ProductWelcome } from "@/components/productWelcome";
import { PromptReq } from "@/components/stream/promptReq";
import { TextInput } from "@/components/question/textInput";
import { FactorSelector } from "@/components/question/factorSelector";

interface MajorOption {
  majorTitle: string;
  descriptionOfMajor: string;
  whyThisMajor: string;
}

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
        {currentStage > 1 && (
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardBody className="p-4" onClick={() => handleEditStage(1)}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Favorite Subject:
                  </p>
                  <p className="text-lg">{userInputs.favoriteSubject}</p>
                </div>
                <Button color="primary" size="sm" variant="light">
                  Edit
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStage > 2 && (
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardBody className="p-4" onClick={() => handleEditStage(2)}>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-muted-foreground">
                    Selections & Importance:
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Factor 1: {userInputs.factors.factor1.value} (Importance:{" "}
                      {userInputs.factors.factor1.importance}/5)
                    </p>
                    <p className="text-sm">
                      Factor 2: {userInputs.factors.factor2.value} (Importance:{" "}
                      {userInputs.factors.factor2.importance}/5)
                    </p>
                    <p className="text-sm">
                      Factor 3: {userInputs.factors.factor3.value} (Importance:{" "}
                      {userInputs.factors.factor3.importance}/5)
                    </p>
                  </div>
                </div>
                <Button color="primary" size="sm" variant="light">
                  Edit
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {currentStage > 3 && (
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardBody className="p-4" onClick={() => handleEditStage(3)}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">
                    Post-College Plans:
                  </p>
                  <p className="text-lg">{userInputs.postCollegePlans}</p>
                </div>
                <Button color="primary" size="sm" variant="light">
                  Edit
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
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
            buttonText="Complete"
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
                buttonColor="success"
                buttonSize="lg"
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
                onResponse={(response) => setGeneration(response)}
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
                            <Card key={index} className="w-full">
                              <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
                                <h4 className="font-bold text-large text-primary">
                                  {option.majorTitle}
                                </h4>
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
