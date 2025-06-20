/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Textarea } from "@heroui/input";
import { Slider } from "@heroui/slider";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import { ProductWelcome } from "@/components/productWelcome";

interface MajorOption {
  majorTitle: string;
  descriptionOfMajor: string;
  whyThisMajor: string;
}

interface UserInputs {
  favoriteSubject: string;
  dropdownSelections: {
    dropdown1: string;
    dropdown2: string;
    dropdown3: string;
  };
  importanceRatings: {
    dropdown1: number;
    dropdown2: number;
    dropdown3: number;
  };
  postCollegePlans: string;
}

export default function MajorMentorPage() {
  const [currentStage, setCurrentStage] = useState(1);
  const [userInputs, setUserInputs] = useState<UserInputs>({
    favoriteSubject: "",
    dropdownSelections: {
      dropdown1: "",
      dropdown2: "",
      dropdown3: "",
    },
    importanceRatings: {
      dropdown1: 1,
      dropdown2: 1,
      dropdown3: 1,
    },
    postCollegePlans: "",
  });
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dropdownOptions = [
    { value: "salary", label: "Salary" },
    { value: "work-life balance", label: "Work-life Balance" },
    { value: "job satisfaction", label: "Job Satisfaction" },
    { value: "helping others", label: "Helping Others" },
    { value: "job security", label: "Job Security" },
  ];

  const handleStage1Submit = () => {
    if (userInputs.favoriteSubject.trim()) {
      setCurrentStage(2);
    }
  };

  const handleStage2Submit = () => {
    if (
      userInputs.dropdownSelections.dropdown1 &&
      userInputs.dropdownSelections.dropdown2 &&
      userInputs.dropdownSelections.dropdown3
    ) {
      setCurrentStage(3);
    }
  };

  const handleStage3Submit = () => {
    if (userInputs.postCollegePlans.trim()) {
      setCurrentStage(4);
    }
  };

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
                      Factor 1: {userInputs.dropdownSelections.dropdown1}{" "}
                      (Importance: {userInputs.importanceRatings.dropdown1}/5)
                    </p>
                    <p className="text-sm">
                      Factor 2: {userInputs.dropdownSelections.dropdown2}{" "}
                      (Importance: {userInputs.importanceRatings.dropdown2}/5)
                    </p>
                    <p className="text-sm">
                      Factor 3: {userInputs.dropdownSelections.dropdown3}{" "}
                      (Importance: {userInputs.importanceRatings.dropdown3}/5)
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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">
              What was your favorite subject in school?
            </h3>
            <Textarea
              className="w-full"
              label="Favorite Subject"
              placeholder="Tell us about your favorite subject and why you enjoyed it..."
              value={userInputs.favoriteSubject}
              onValueChange={(value) =>
                setUserInputs({ ...userInputs, favoriteSubject: value })
              }
            />
            <div className="flex justify-center">
              <Button
                color="primary"
                isDisabled={!userInputs.favoriteSubject.trim()}
                onClick={handleStage1Submit}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStage === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center">
              Select your factors and rate their importance:
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="text-sm font-medium">Factor 1</div>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userInputs.dropdownSelections.dropdown1}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        dropdownSelections: {
                          ...userInputs.dropdownSelections,
                          dropdown1: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Select an option</option>
                    {dropdownOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Importance: {userInputs.importanceRatings.dropdown1}/5
                  </div>
                  <Slider
                    className="w-full"
                    maxValue={5}
                    minValue={1}
                    step={1}
                    value={userInputs.importanceRatings.dropdown1}
                    onChange={(value) =>
                      setUserInputs({
                        ...userInputs,
                        importanceRatings: {
                          ...userInputs.importanceRatings,
                          dropdown1: Array.isArray(value) ? value[0] : value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Factor 2</div>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userInputs.dropdownSelections.dropdown2}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        dropdownSelections: {
                          ...userInputs.dropdownSelections,
                          dropdown2: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Select an option</option>
                    {dropdownOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Importance: {userInputs.importanceRatings.dropdown2}/5
                  </div>
                  <Slider
                    className="w-full"
                    maxValue={5}
                    minValue={1}
                    step={1}
                    value={userInputs.importanceRatings.dropdown2}
                    onChange={(value) =>
                      setUserInputs({
                        ...userInputs,
                        importanceRatings: {
                          ...userInputs.importanceRatings,
                          dropdown2: Array.isArray(value) ? value[0] : value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Factor 3</div>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userInputs.dropdownSelections.dropdown3}
                    onChange={(e) =>
                      setUserInputs({
                        ...userInputs,
                        dropdownSelections: {
                          ...userInputs.dropdownSelections,
                          dropdown3: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Select an option</option>
                    {dropdownOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Importance: {userInputs.importanceRatings.dropdown3}/5
                  </div>
                  <Slider
                    className="w-full"
                    maxValue={5}
                    minValue={1}
                    step={1}
                    value={userInputs.importanceRatings.dropdown3}
                    onChange={(value) =>
                      setUserInputs({
                        ...userInputs,
                        importanceRatings: {
                          ...userInputs.importanceRatings,
                          dropdown3: Array.isArray(value) ? value[0] : value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                color="primary"
                isDisabled={
                  !userInputs.dropdownSelections.dropdown1 ||
                  !userInputs.dropdownSelections.dropdown2 ||
                  !userInputs.dropdownSelections.dropdown3
                }
                onClick={handleStage2Submit}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStage === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">
              What are your plans after college?
            </h3>
            <Textarea
              className="w-full"
              label="Post-College Plans"
              placeholder="Describe your career goals, further education plans, or other aspirations..."
              value={userInputs.postCollegePlans}
              onValueChange={(value) =>
                setUserInputs({ ...userInputs, postCollegePlans: value })
              }
            />
            <div className="flex justify-center">
              <Button
                color="primary"
                isDisabled={!userInputs.postCollegePlans.trim()}
                onClick={handleStage3Submit}
              >
                Complete
              </Button>
            </div>
          </div>
        )}

        {currentStage === 4 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Ready to find your perfect major?
            </h3>
            {!isLoading && !generation && (
              <Button
                color="success"
                size="lg"
                onClick={async () => {
                  setIsLoading(true);

                  const resStructure = [
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
                  ];

                  await fetch("/api/completion", {
                    method: "POST",
                    body: JSON.stringify({
                      system:
                        "You are a college admission advisor who is helping a student chosing their possible major in college" +
                        "You will receive the student's inputs in JSON of their favorite subject, 3 things that are important with their importance ratings, and post-college plans." +
                        "You will give 3 possible majors that fit the student's inputs, and a brief summary of each major and why it is a good fit." +
                        "You will return the response in a JSON format of the following structure: " +
                        JSON.stringify(resStructure),
                      model: openai("gpt-3.5-turbo"),
                      prompt: `Given the following user inputs: ${JSON.stringify(userInputs)}`,
                    }),
                  }).then((response) => {
                    response.json().then((json) => {
                      setGeneration(json.text);
                      setIsLoading(false);
                    });
                  });
                }}
              >
                Find Me A Major!
              </Button>
            )}
            {isLoading && (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-lg">Loading...</div>
                <div className="text-sm text-muted-foreground">
                  Finding your perfect major match...
                </div>
              </div>
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
