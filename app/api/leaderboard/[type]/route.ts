import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardType, LeaderboardEntry } from "@/lib/types";
import { calculateRanks } from "@/lib/utils";
import { getPrimaryMetric, getPrimaryMetricConfig } from "@/lib/leaderboard-config";

// GET /api/leaderboard/[type]
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    
    // Validate leaderboard type
    if (!["opensplat", "unet", "orbslam3"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid leaderboard type" },
        { status: 400 }
      );
    }

    // Read data from JSON file
    const filePath = path.join(process.cwd(), "data", `${type}.json`);
    const fileContents = await fs.readFile(filePath, "utf8");
    const data: LeaderboardEntry[] = JSON.parse(fileContents);

    // Calculate ranks based on primary metric
    const primaryMetric = getPrimaryMetric(type);
    const metricConfig = getPrimaryMetricConfig(type);
    const rankedData = calculateRanks(
      data,
      primaryMetric,
      metricConfig?.higherIsBetter || false
    );

    return NextResponse.json({
      success: true,
      data: rankedData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}

