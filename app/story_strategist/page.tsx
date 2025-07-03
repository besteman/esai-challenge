"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ProductWelcome } from "@/components/productWelcome";
import { PromptReq } from "@/components/stream/promptReq";
import { RefineOutputPrompt } from "@/components/refineOutputPrompt";
import { TextInput } from "@/components/question/textInput";
import { EditableCard } from "@/components/summary/editableCard";
import { StoryStrategistRecommendationList } from "@/components/summary/storyStrategistRecommendationList";
import { storyStrategistPrompt } from "@/lib/prompts";
import { useAuthenticatedUser } from "@/lib/auth";

interface UserInputs {
  feelMostLikeYourself: string;
  hardship: string;
  neverGetBored: string;
  familyBackground: string;
  proudAchievement: string;
  knownIn10Years: string;
  whatSetsYouApart: string;
  postCollegePlans?: string;
  refinement?: string;
}

export default function StoryStrategistPage() {
  const router = useRouter();
  const { userId, isAuthenticated, isLoading } = useAuthenticatedUser();

  const [currentStage, setCurrentStage] = useState(1);
  const [userInputs, setUserInputs] = useState<UserInputs>({
    feelMostLikeYourself: "",
    hardship: "",
    neverGetBored: "",
    familyBackground: "",
    proudAchievement: "",
    knownIn10Years: "",
    whatSetsYouApart: "",
    postCollegePlans: "",
    refinement: "",
  });
  const [generation, setGeneration] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [starredStates, setStarredStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-default-600">Loading...</p>
        </div>
      </section>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Function to toggle starred state for a story recommendation
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
        const response = await fetch("/api/db/postStoryStrategist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
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
  const saveStoryRecommendation = async (generationResponse: string) => {
    try {
      const response = await fetch("/api/db/postStoryStrategist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
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
      console.error("Error saving story recommendation:", error);
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
          title="When do you feel most like yourself?"
          value={userInputs.feelMostLikeYourself}
          onEdit={() => handleEditStage(1)}
        />

        <EditableCard
          show={currentStage > 2}
          title="Tell us about a hardship or challenge"
          value={userInputs.hardship}
          onEdit={() => handleEditStage(2)}
        />

        <EditableCard
          show={currentStage > 3}
          title="What's something you never get bored of?"
          value={userInputs.neverGetBored}
          onEdit={() => handleEditStage(3)}
        />

        <EditableCard
          show={currentStage > 4}
          title="Tell us about your family"
          value={userInputs.familyBackground}
          onEdit={() => handleEditStage(4)}
        />

        <EditableCard
          show={currentStage > 5}
          title="What are you most proud of achieving?"
          value={userInputs.proudAchievement}
          onEdit={() => handleEditStage(5)}
        />

        <EditableCard
          show={currentStage > 6}
          title="How do you want to be known in 10 years?"
          value={userInputs.knownIn10Years}
          onEdit={() => handleEditStage(6)}
        />

        <EditableCard
          show={currentStage > 7}
          title="What sets you apart from your friends and classmates?"
          value={userInputs.whatSetsYouApart}
          onEdit={() => handleEditStage(7)}
        />
      </div>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <ProductWelcome
        description="Discover what makes your story unique and turn it into a clear, powerful college application narrative."
        heading="Let’s get to know you!"
        subtitle="Share the pieces of your story that are most important to you."
        title="Story Strategist"
      />

      {renderPreviousInputs()}

      <div className="w-full max-w-2xl">
        {currentStage === 1 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.feelMostLikeYourself}
            label="Who are you when you feel most like yourself?"
            placeholder="It could be when you're helping someone, being creative, standing up for something, or just laughing with your friends"
            question="When do you feel most like yourself?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, feelMostLikeYourself: value });
              setCurrentStage(2);
            }}
          />
        )}

        {currentStage === 2 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.hardship}
            label="Learning to learn with challenges"
            placeholder="This isn't about picking the “worst” thing that's ever happened to you — it's about a challenge you faced and what it showed you about yourself."
            question="Tell us about a hardship or challenge"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, hardship: value });
              setCurrentStage(3);
            }}
          />
        )}

        {currentStage === 3 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.neverGetBored}
            label="What is something you could never get bored of?"
            placeholder="Asking questions, solving puzzles, or helping others"
            question="What's something you never get bored of?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, neverGetBored: value });
              setCurrentStage(4);
            }}
          />
        )}

        {currentStage === 4 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.familyBackground}
            label="Tell us about your family background"
            placeholder="Immigrant family from the Netherlands"
            question="Tell us about your family"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, familyBackground: value });
              setCurrentStage(5);
            }}
          />
        )}

        {currentStage === 5 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.proudAchievement}
            label="What are you most proud of achieving?"
            placeholder="Being cast in a play, playing a sport, or volunteering"
            question="What are you most proud of achieving?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, proudAchievement: value });
              setCurrentStage(6);
            }}
          />
        )}

        {currentStage === 6 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.knownIn10Years}
            label="How do you want to be known in 10 years?"
            placeholder="I want to be known as a leader in my field, a compassionate person, or an innovator"
            question="How do you want to be known in 10 years?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, knownIn10Years: value });
              setCurrentStage(7);
            }}
          />
        )}

        {currentStage === 7 && (
          <TextInput
            buttonText="Next"
            initialValue={userInputs.whatSetsYouApart}
            label="What sets you apart from your friends and classmates?"
            placeholder="Growing up European in home and American outside the home"
            question="What sets you apart from your friends and classmates?"
            onSubmit={(value) => {
              setUserInputs({ ...userInputs, whatSetsYouApart: value });
              setCurrentStage(8);
            }}
          />
        )}

        {currentStage === 8 && (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Ready to craft your story?
            </h3>
            {!generation && (
              <PromptReq
                buttonText={
                  isRefining ? "Click with refinement" : "Create my stories!"
                }
                loadingSubtext={
                  isRefining
                    ? "Refining your story recommendations..."
                    : "Finding your perfect stories..."
                }
                loadingText="Loading..."
                systemPrompt={storyStrategistPrompt.complete}
                userPrompt={
                  isRefining
                    ? `Given the following user inputs: ${JSON.stringify(userInputs)}

                       Please refine the previous story recommendations based on this additional request: "${userInputs.refinement}"`
                    : `Given the following user inputs: ${JSON.stringify(userInputs)}`
                }
                onResponse={async (response) => {
                  setGeneration(response);
                  setIsRefining(false);
                  await saveStoryRecommendation(response);
                }}
              />
            )}
            {generation && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center mb-4">
                  Your Story Recommendations:
                </h4>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <StoryStrategistRecommendationList
                    generation={generation}
                    starredStates={starredStates}
                    onToggleStarred={toggleStarred}
                  />
                </div>
                <RefineOutputPrompt
                  buttonOptions={[
                    "Add more specific examples and anecdotes",
                    "Focus on leadership and initiative themes",
                    "Emphasize personal growth and resilience",
                  ]}
                  onRefine={async (refinementText: string) => {
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
