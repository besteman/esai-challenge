import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import { SchoolMatchOption, SchoolMatchRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: SchoolMatchRequest = await request.json();
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

    // Parse the generation response to extract individual recommendations
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
      `DELETE FROM school_match_maker
       WHERE user_id = $1
       AND location = $2
       AND location_requirements = $3
       AND future_plans = $4
       AND ideal_campus_experience = $5
       AND unweighted_gpa = $6`,
      [
        userId,
        userInputs.location,
        userInputs.locationRequirements,
        userInputs.futurePlans,
        userInputs.idealCampusExperience,
        userInputs.unweightedGPA,
      ],
    );

    // Save each school recommendation to the database
    for (let index = 0; index < parsedResponse.length; index++) {
      const item = parsedResponse[index];
      const optionKey = Object.keys(item)[0];
      const option: SchoolMatchOption = item[optionKey];
      const isStarred = starredStates[index] || false;

      const result = await executeQuery(
        `INSERT INTO school_match_maker
         (output_group, location, location_requirements, future_plans,
          ideal_campus_experience, unweighted_gpa, college_name,
          description_of_college, why_this_college, starred, user_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         RETURNING id`,
        [
          outputGroupId,
          userInputs.location,
          userInputs.locationRequirements,
          userInputs.futurePlans,
          userInputs.idealCampusExperience,
          userInputs.unweightedGPA,
          option.collegeName,
          option.descriptionOfCollege,
          option.whyThisCollege,
          isStarred,
          userId,
        ],
      );

      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${results.length} school recommendations`,
      outputGroupId,
      insertedIds: results
        .map((result) => (result as any)?.[0]?.id)
        .filter(Boolean),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving school match data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save school match recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
