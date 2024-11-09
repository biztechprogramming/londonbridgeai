import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();

    // Set appropriate headers for file download
    const headers = new Headers();
    headers.set("Content-Type", "image/png");
    headers.set(
      "Content-Disposition",
      `attachment; filename=london-bridge-${Date.now()}.png`
    );

    return new NextResponse(imageBlob, { headers });
  } catch (error) {
    console.error("Error downloading image:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
