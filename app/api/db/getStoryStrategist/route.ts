import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import {
  ErrorResponse,
  StoryStrategistRecord,
  StoryStrategistResponse,
} from "@/types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<StoryStrategistResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const starred = searchParams.get("starred");

    // Build the base query
    let query = "SELECT * FROM story_strategist";
    const params: any[] = [];

    // Add WHERE condition for starred filter if provided
    if (starred !== null && starred !== undefined) {
      query += " WHERE starred = $1";
      params.push(starred === "true");
    }

    // Order by creation date (newest first)
    query += " ORDER BY created_at DESC";

    // Execute the query
    const results = await executeQuery(query, params);

    const storyStrategistData = Array.isArray(results)
      ? (results as StoryStrategistRecord[])
      : [];

    // Return the results
    const response: StoryStrategistResponse = {
      success: true,
      data: storyStrategistData,
      count: storyStrategistData.length,
      message: "Story strategist recommendations fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching story strategist data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch story strategist recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
