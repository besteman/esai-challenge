import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { executeTransaction } from "@/lib/db";

interface SchoolMatchOption {
  collegeName: string;
  descriptionOfCollege: string;
  whyThisCollege: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInputs, generationResponse, starredStates } = body;

    // Validate required fields
    if (!userInputs || !generationResponse) {
      return NextResponse.json(
        { error: "Missing required fields: userInputs and generationResponse" },
        { status: 400 },
      );
    }

    // Generate a UUID for this group of recommendations
    const outputGroup = randomUUID();

    // Parse the generation response to extract individual recommendations
    let schoolOptions: SchoolMatchOption[] = [];

    try {
      const parsedResponse = JSON.parse(generationResponse);

      schoolOptions = parsedResponse.map((item: any) => {
        const optionKey = Object.keys(item)[0];

        return item[optionKey];
      });
    } catch {
      return NextResponse.json(
        { error: "Invalid generation response format" },
        { status: 400 },
      );
    }

    // Prepare insert queries for each school recommendation
    const insertQueries = schoolOptions.map((option, index) => ({
      sql: `
        INSERT INTO school_match_maker (
          output_group, location, location_requirements, future_plans,
          ideal_campus_experience, unweighted_gpa, college_name,
          description_of_college, why_this_college, starred, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      `,
      params: [
        outputGroup,
        userInputs.location,
        userInputs.locationRequirements,
        userInputs.futurePlans,
        userInputs.idealCampusExperience,
        userInputs.unweightedGPA,
        option.collegeName,
        option.descriptionOfCollege,
        option.whyThisCollege,
        starredStates?.[index] || false,
      ],
    }));

    // Execute all insert queries in a transaction
    const results = await executeTransaction(insertQueries);

    return NextResponse.json({
      success: true,
      data: {
        outputGroup,
        insertedCount: results.length,
        insertedRecords: results, // Return the inserted records with IDs
        userInputs,
        schoolOptions,
      },
      message: "School match recommendations saved successfully",
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
