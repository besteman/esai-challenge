import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import { AllStarredResponse, ErrorResponse, StarredItem } from "@/types";

export async function GET(
  _request: NextRequest,
): Promise<NextResponse<AllStarredResponse | ErrorResponse>> {
  try {
    // Query for starred school matches
    const schoolMatchQuery = `
      SELECT
        'school_match' as type,
        id,
        college_name as title,
        description_of_college as description,
        why_this_college as why_recommendation,
        created_at
      FROM school_match_maker
      WHERE starred = true
      ORDER BY created_at DESC
    `;

    // Query for starred major mentor recommendations
    const majorMentorQuery = `
      SELECT
        'major_mentor' as type,
        id,
        major_title as title,
        description_of_major as description,
        why_this_major as why_recommendation,
        created_at
      FROM major_mentor
      WHERE starred = true
      ORDER BY created_at DESC
    `;

    // Query for starred story strategist recommendations
    const storyStrategistQuery = `
      SELECT
        'story_strategist' as type,
        id,
        title,
        summary as description,
        '' as why_recommendation,
        created_at
      FROM story_strategist
      WHERE starred = true
      ORDER BY created_at DESC
    `;

    // Execute all queries
    const [schoolMatches, majorMentors, storyStrategists] = await Promise.all([
      executeQuery(schoolMatchQuery),
      executeQuery(majorMentorQuery),
      executeQuery(storyStrategistQuery),
    ]);

    // Combine all results and sort by created_at
    const allStarredItems = [
      ...(Array.isArray(schoolMatches) ? schoolMatches : []),
      ...(Array.isArray(majorMentors) ? majorMentors : []),
      ...(Array.isArray(storyStrategists) ? storyStrategists : []),
    ].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ) as StarredItem[];

    const response: AllStarredResponse = {
      success: true,
      data: allStarredItems,
      count: allStarredItems.length,
      breakdown: {
        school_matches: Array.isArray(schoolMatches) ? schoolMatches.length : 0,
        major_mentors: Array.isArray(majorMentors) ? majorMentors.length : 0,
        story_strategists: Array.isArray(storyStrategists)
          ? storyStrategists.length
          : 0,
      },
      message: "All starred recommendations fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching all starred data:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Failed to fetch starred recommendations",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
