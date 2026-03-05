import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return NextResponse.json(
      { error: "GA4 not configured" },
      { status: 503 }
    );
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsData = google.analyticsdata({ version: "v1beta", auth });
    const property = `properties/${propertyId}`;

    const [pageViewsReport, topPagesReport, trafficReport] = await Promise.all(
      [
        analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [
              { name: "screenPageViews" },
              { name: "sessions" },
              { name: "activeUsers" },
            ],
            dimensions: [{ name: "date" }],
            orderBys: [{ dimension: { dimensionName: "date" } }],
          },
        }),
        analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [{ name: "screenPageViews" }],
            dimensions: [{ name: "pagePath" }],
            orderBys: [
              { metric: { metricName: "screenPageViews" }, desc: true },
            ],
            limit: "10",
          },
        }),
        analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
            metrics: [{ name: "sessions" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            limit: "10",
          },
        }),
      ]
    );

    return NextResponse.json({
      pageViews: pageViewsReport.data.rows ?? [],
      topPages: topPagesReport.data.rows ?? [],
      trafficSources: trafficReport.data.rows ?? [],
    });
  } catch (err) {
    console.error("GA4 API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch GA4 data" },
      { status: 500 }
    );
  }
}
