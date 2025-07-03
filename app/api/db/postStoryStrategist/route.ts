import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import { StoryOption, StoryStrategistRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: StoryStrategistRequest = await request.json();
    const { userId, userInputs, generationResponse, starredStates = {} } = body;

    // Validate required fields
    if (!userId || !userInputs || !generationResponse) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: userId, userInputs and generationResponse",
        },
        { status: 400 },
      );
    }

    // Parse the generation response to extract story recommendations
    let parsedResponse;

    try {
      parsedResponse = JSON.parse(generationResponse);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in generationResponse" },
        { status: 400 },
      );
    }

    const results = [];

    // Generate a UUID for this output group (all recommendations from this generation)
    const outputGroupId = randomUUID();

    // First, delete any existing records for this user and session (based on user inputs)
    // This ensures we don't have duplicates when users toggle stars multiple times
    await executeQuery(
      `DELETE FROM story_strategist
       WHERE user_id = $1
       AND feelMostLikeYourself = $2
       AND hardship = $3
       AND never_get_bored = $4
       AND family_background = $5
       AND proud_achievement = $6
       AND known_in_10_years = $7
       AND what_sets_you_apart = $8`,
      [
        userId,
        userInputs.feelMostLikeYourself,
        userInputs.hardship,
        userInputs.neverGetBored,
        userInputs.familyBackground,
        userInputs.proudAchievement,
        userInputs.knownIn10Years,
        userInputs.whatSetsYouApart,
      ],
    );

    // Save each story recommendation to the database
    for (let index = 0; index < parsedResponse.length; index++) {
      const item = parsedResponse[index];
      const optionKey = Object.keys(item)[0];
      const option: StoryOption = item[optionKey];
      const isStarred = starredStates[index] || false;

      const result = await executeQuery(
        `INSERT INTO story_strategist
         (output_group, feelMostLikeYourself, hardship, never_get_bored,
          family_background, proud_achievement, known_in_10_years,
          what_sets_you_apart, post_college_plans, title, summary, starred, user_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
         RETURNING id`,
        [
          outputGroupId,
          userInputs.feelMostLikeYourself,
          userInputs.hardship,
          userInputs.neverGetBored,
          userInputs.familyBackground,
          userInputs.proudAchievement,
          userInputs.knownIn10Years,
          userInputs.whatSetsYouApart,
          userInputs.postCollegePlans || "",
          option.title,
          option.summary,
          isStarred,
          userId,
        ],
      );

      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${results.length} story recommendations`,
      outputGroupId,
      insertedIds: results
        .map((result) => (result as any)?.[0]?.id)
        .filter(Boolean),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving story strategist data:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
