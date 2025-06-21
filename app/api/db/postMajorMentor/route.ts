import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";

interface MajorOption {
  majorTitle: string;
  descriptionOfMajor: string;
  whyThisMajor: string;
  starred?: boolean;
}

interface MajorMentorRequest {
  userInputs: {
    favoriteSubject: string;
    factors: {
      factor1: { value: string; importance: number };
      factor2: { value: string; importance: number };
      factor3: { value: string; importance: number };
    };
    postCollegePlans: string;
  };
  generationResponse: string;
  starredStates?: { [key: number]: boolean };
}

export async function POST(request: NextRequest) {
  try {
    const body: MajorMentorRequest = await request.json();
    const { userInputs, generationResponse, starredStates = {} } = body;

    // Validate required fields
    if (!userInputs || !generationResponse) {
      return NextResponse.json(
        { error: "Missing required fields: userInputs and generationResponse" },
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

    // First, delete any existing records for this user session (based on user inputs)
    // This ensures we don't have duplicates when users toggle stars multiple times
    await executeQuery(
      `DELETE FROM major_mentor
       WHERE favorite_subject = $1
       AND factor_one = $2
       AND factor_two = $3
       AND factor_three = $4`,
      [
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
          major_title, description_of_major, why_this_major, starred, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
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
