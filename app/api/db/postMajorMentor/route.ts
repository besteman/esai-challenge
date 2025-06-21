import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";

interface MajorOption {
  majorTitle: string;
  descriptionOfMajor: string;
  whyThisMajor: string;
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
}

export async function POST(request: NextRequest) {
  try {
    const body: MajorMentorRequest = await request.json();
    const { userInputs, generationResponse } = body;

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

    // Save each major recommendation to the database
    for (const item of parsedResponse) {
      const optionKey = Object.keys(item)[0];
      const option: MajorOption = item[optionKey];

      const result = await executeQuery(
        `INSERT INTO major_mentor
         (favorite_subject, factor_one, factor_two, factor_three,
          factor_one_importance, factor_two_importance, factor_three_importance,
          major_title, description_of_major, why_this_major, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         RETURNING id`,
        [
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
        ],
      );

      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully saved ${results.length} major recommendations`,
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
