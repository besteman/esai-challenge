"use client";

import { useState } from "react";

import { ProductWelcome } from "@/components/productWelcome";
import { PromptReq } from "@/components/stream/promptReq";
import { TextInput } from "@/components/question/textInput";
import { FactorSelector } from "@/components/question/factorSelector";
import { EditableCard } from "@/components/summary/editableCard";
import { FactorsCard } from "@/components/summary/factorsCard";
import { MajorRecommendationList } from "@/components/summary/majorRecommendationList";
import { RefineOutputPrompt } from "@/components/refineOutputPrompt";
import { majorMentorPrompt } from "@/lib/prompts";

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
  refinement?: string;
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
    refinement: "",
  });
  const [generation, setGeneration] = useState("");
  const [isRefining, setIsRefining] = useState(false);
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
            disableWordCount={true}
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
                buttonText={
                  isRefining ? "Click with refinement" : "Find Me A Major!"
                }
                loadingSubtext={
                  isRefining
                    ? "Refining your major recommendations..."
                    : "Finding your perfect major match..."
                }
                loadingText="Loading..."
                systemPrompt={majorMentorPrompt.complete}
                userPrompt={
                  isRefining
                    ? `Given the following user inputs: ${JSON.stringify(userInputs)}

                       Please refine the previous major recommendations based on this additional request: "${userInputs.refinement}"`
                    : `Given the following user inputs: ${JSON.stringify(userInputs)}`
                }
                onResponse={async (response) => {
                  setGeneration(response);
                  setIsRefining(false);
                  await saveMajorRecommendation(response);
                }}
              />
            )}
            {generation && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center mb-4">
                  Your Recommended Majors:
                </h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <MajorRecommendationList
                    generation={generation}
                    starredStates={starredStates}
                    onToggleStarred={toggleStarred}
                  />
                </div>
                <RefineOutputPrompt
                  buttonOptions={[
                    "Include majors with a global focus",
                    "Suggest majors emphasizing social impact",
                    "Explore interdisciplinary options with technology",
                  ]}
                  onRefine={async (refinementText) => {
                    setIsRefining(true);
                    setUserInputs({
                      ...userInputs,
                      refinement: refinementText,
                    });

                    // Clear current generation to show loading state
                    setGeneration("");
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
