import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import { ErrorResponse, SchoolMatchRecord, SchoolMatchResponse } from "@/types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SchoolMatchResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const starred = searchParams.get("starred");

    // Build the base query
    let query = "SELECT * FROM school_match_maker";
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

    const schoolMatchData = Array.isArray(results)
      ? (results as SchoolMatchRecord[])
      : [];

    // Return the results
    const response: SchoolMatchResponse = {
      success: true,
      data: schoolMatchData,
      count: schoolMatchData.length,
      message: "School match recommendations fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching school match data:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Failed to fetch school match recommendations",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
