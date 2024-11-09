import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a photorealistic image of the London Bridge with the following modifications: ${prompt}. The image should be highly detailed and maintain architectural accuracy while incorporating the requested modifications.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    // Get the generated image URL
    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error("No image was generated");
    }

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
