import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import { MajorMentorRequest, MajorOption } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: MajorMentorRequest = await request.json();
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

    // Parse the generation response to extract major recommendations
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
      `DELETE FROM major_mentor
       WHERE user_id = $1
       AND favorite_subject = $2
       AND factor_one = $3
       AND factor_two = $4
       AND factor_three = $5`,
      [
        userId,
        userInputs.favoriteSubject,
        userInputs.factors.factor1.value,
        userInputs.factors.factor2.value,
        userInputs.factors.factor3.value,
      ],
    );

    // Save each major recommendation to the database
    for (let index = 0; index < parsedResponse.length; index++) {
      const item = parsedResponse[index];
      const optionKey = Object.keys(item)[0];
      const option: MajorOption = item[optionKey];
      const isStarred = starredStates[index] || false;

      const result = await executeQuery(
        `INSERT INTO major_mentor
         (output_group, favorite_subject, factor_one, factor_two, factor_three,
          factor_one_importance, factor_two_importance, factor_three_importance,
          major_title, description_of_major, why_this_major, starred, user_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
         RETURNING id`,
        [
          outputGroupId,
          userInputs.favoriteSubject,
          userInputs.factors.factor1.value,
          userInputs.factors.factor2.value,
          userInputs.factors.factor3.value,
          userInputs.factors.factor1.importance,
          userInputs.factors.factor2.importance,
          userInputs.factors.factor3.importance,
          option.majorTitle,
          option.descriptionOfMajor,
          option.whyThisMajor,
          isStarred,
          userId,
        ],
      );

      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${results.length} major recommendations`,
      outputGroupId,
      insertedIds: results
        .map((result) => (result as any)?.[0]?.id)
        .filter(Boolean),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving major mentor data:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
