import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import {
  ErrorResponse,
  SessionHistoryItem,
  SessionHistoryResponse,
} from "@/types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SessionHistoryResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required", success: false, details: "" },
        { status: 400 },
      );
    }
    // Query to get distinct output_group values from all tables with their creation dates
    const sessionHistoryQuery = `
      SELECT DISTINCT
        output_group,
        'school_match' as table_name,
        'School Match Maker' as display_name,
        MIN(college_name) as display_title,
        MIN(why_this_college) as display_description,
        MIN(created_at) as created_at
      FROM school_match_maker
      WHERE output_group IS NOT NULL AND user_id = $1
      GROUP BY output_group

      UNION ALL

      SELECT DISTINCT
        output_group,
        'major_mentor' as table_name,
        'Major Mentor' as display_name,
        MIN(major_title) as display_title,
        MIN(description_of_major) as display_description,
        MIN(created_at) as created_at
      FROM major_mentor
      WHERE output_group IS NOT NULL AND user_id = $1
      GROUP BY output_group

      UNION ALL

      SELECT DISTINCT
        output_group,
        'story_strategist' as table_name,
        'Story Strategist' as display_name,
        MIN(title) as display_title,
        MIN(summary) as display_description,
        MIN(created_at) as created_at
      FROM story_strategist
      WHERE output_group IS NOT NULL AND user_id = $1
      GROUP BY output_group

      ORDER BY created_at DESC
    `;

    const results = await executeQuery(sessionHistoryQuery, [userId]);

    const sessionHistory = Array.isArray(results) ? results : [];

    const response: SessionHistoryResponse = {
      success: true,
      data: sessionHistory as SessionHistoryItem[],
      count: sessionHistory.length,
      message: "Session history fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching session history:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Failed to fetch session history",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
