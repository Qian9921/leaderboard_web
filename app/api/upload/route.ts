import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardEntry } from "@/lib/types";

// POST /api/upload
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data: entryData } = body;

    // Validate leaderboard type
    if (!["opensplat", "unet", "orbslam3"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid leaderboard type" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !entryData.studentId ||
      !entryData.studentName ||
      !entryData.githubUsername
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add submission date
    entryData.submissionDate = new Date().toISOString();

    // Read existing data
    const filePath = path.join(process.cwd(), "data", `${type}.json`);
    const fileContents = await fs.readFile(filePath, "utf8");
    const existingData: LeaderboardEntry[] = JSON.parse(fileContents);

    // Check if student already submitted (update if exists)
    const existingIndex = existingData.findIndex(
      (entry) => entry.studentId === entryData.studentId
    );

    if (existingIndex >= 0) {
      existingData[existingIndex] = entryData;
    } else {
      existingData.push(entryData);
    }

    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: existingIndex >= 0 ? "Entry updated successfully" : "Entry added successfully",
      entry: entryData,
    });
  } catch (error) {
    console.error("Error uploading entry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload entry" },
      { status: 500 }
    );
  }
}

