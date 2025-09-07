import { inngest } from "@/inngest/client";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must login in to save preferences" },
      {
        status: 401,
      }
    );
  }
  try {
    const body = await request.json();
    const { email, frequency, categories } = body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "Select at least one category " },
        { status: 400 }
      );
    }
    if (!frequency || !["daily", "weekly", "biweekly"].includes(frequency)) {
      return NextResponse.json(
        { error: "Valid frequency is required (daily, weekly, biweekly)" },
        { status: 400 }
      );
    }

    const { error: upsertError } = await supabase
      .from("user_preference")
      .upsert(
        {
          user_id: user.id,
          categories: categories,
          frequency: frequency,
          email: email,
          is_active: true,
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("Error saving preferences:", upsertError);
      return NextResponse.json(
        { error: "Failed to save preferences" },
        { status: 500 }
      );
    }

    let scheduleTime: Date;
    const now = new Date();
    switch (frequency) {
      case "daily":
        // Schedule for tomorrow at 9 AM
        scheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        scheduleTime.setHours(9, 0, 0, 0);
        break;
      case "weekly":
        // Schedule for next week on the same day at 9 AM
        scheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        scheduleTime.setHours(9, 0, 0, 0);
        break;
      case "biweekly":
        // Schedule for 3 days from now at 9 AM
        scheduleTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        scheduleTime.setHours(9, 0, 0, 0);
        break;
      default:
        scheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        scheduleTime.setHours(9, 0, 0, 0);
    }

    const { ids } = await inngest.send({
      name: "newsletter.schedule",
      data: {
        userId: user.id,
        email: email,
        categories: categories,
        frequency: frequency,
      },
      //   ts: nextScheduleTime.getTime(),
    });

    return NextResponse.json({
      success: true,
      message: "Preferences saved successfully!",
      scheduleId: ids[0],
    });
  } catch (error) {
    console.error("Error in user-preferences API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
