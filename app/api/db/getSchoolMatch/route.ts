import { NextRequest, NextResponse } from "next/server";

import { executeQuery } from "@/lib/db";

export async function GET(request: NextRequest) {
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

    // Return the results
    return NextResponse.json({
      success: true,
      data: results || [],
      count: Array.isArray(results) ? results.length : 0,
      message: "School match recommendations fetched successfully",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching school match data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch school match recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
