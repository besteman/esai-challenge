import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";
import { ErrorResponse, MajorMentorRecord, MajorMentorResponse } from "@/types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<MajorMentorResponse | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const starred = searchParams.get("starred");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required", success: false, details: "" },
        { status: 400 },
      );
    }

    // Build the base query
    let query = "SELECT * FROM major_mentor WHERE user_id = $1";
    const params: any[] = [userId];

    // Add WHERE condition for starred filter if provided
    if (starred !== null && starred !== undefined) {
      query += " AND starred = $2";
      params.push(starred === "true");
    }

    // Order by creation date (newest first)
    query += " ORDER BY created_at DESC";

    // Execute the query
    const results = await executeQuery(query, params);

    const majorMentorData = Array.isArray(results)
      ? (results as MajorMentorRecord[])
      : [];

    // Return the results
    const response: MajorMentorResponse = {
      success: true,
      data: majorMentorData,
      count: majorMentorData.length,
      message: "Major mentor recommendations fetched successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching major mentor data:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      error: "Failed to fetch major mentor recommendations",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
