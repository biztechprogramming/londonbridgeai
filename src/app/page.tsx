"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Generate an image of the London Bridge with the following modifications: ${prompt}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setGeneratedImage(data.imageUrl);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error("Error generating image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    generateImage();
  };

  const handleDownload = async () => {
    if (!generatedImage || isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: generatedImage }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `london-bridge-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
      setError("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="grid min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center text-center max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          London Bridge AI
        </h1>
        <p className="text-xl sm:text-2xl mb-12 max-w-3xl">
          Experience the majesty of one of London&apos;s most iconic landmarks
          through stunning imagery
        </p>

        <div className="relative w-full aspect-[16/9] mb-16 rounded-xl overflow-hidden shadow-2xl">
          <Image
            src={
              generatedImage ||
              "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad"
            }
            alt="London Bridge"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
          {generatedImage && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`absolute bottom-4 right-4 px-4 py-2 bg-white/90 dark:bg-black/90 text-black dark:text-white rounded-lg shadow-lg hover:bg-white dark:hover:bg-black transition-colors backdrop-blur-sm ${
                isDownloading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDownloading ? "Saving..." : "Save Image"}
            </button>
          )}
        </div>

        {/* Image Generation Section */}
        <div className="w-full max-w-3xl mb-16 p-8 rounded-xl border border-black/[.08] dark:border-white/[.145] bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">
            Generate Your London Bridge Image
          </h2>
          <p className="text-sm mb-6">
            Describe how you want to see London Bridge. For example:
            &quot;London Bridge at sunset with pink clouds&quot; or &quot;London
            Bridge in a cyberpunk style&quot;
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your image description..."
              className="flex-1 px-4 py-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className={`px-8 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors font-semibold ${
                isGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickPrompt("at sunset with pink clouds")}
              className="px-4 py-2 text-sm rounded-full border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Sunset View
            </button>
            <button
              onClick={() => handleQuickPrompt("at night with city lights")}
              className="px-4 py-2 text-sm rounded-full border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Night Scene
            </button>
            <button
              onClick={() => handleQuickPrompt("on a foggy morning")}
              className="px-4 py-2 text-sm rounded-full border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Foggy Morning
            </button>
            <button
              onClick={() => handleQuickPrompt("in Victorian era style")}
              className="px-4 py-2 text-sm rounded-full border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Historic Style
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 w-full">
          <div className="p-8 rounded-xl border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
            <h3 className="text-xl font-bold mb-4">Historic Legacy</h3>
            <p className="text-sm sm:text-base">
              A bridge has existed at this site since Roman times, making it one
              of London&apos;s oldest river crossings
            </p>
          </div>
          <div className="p-8 rounded-xl border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
            <h3 className="text-xl font-bold mb-4">Modern Engineering</h3>
            <p className="text-sm sm:text-base">
              The current bridge combines contemporary design with traditional
              aesthetics
            </p>
          </div>
          <div className="p-8 rounded-xl border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
            <h3 className="text-xl font-bold mb-4">Cultural Icon</h3>
            <p className="text-sm sm:text-base">
              A symbol of London recognized worldwide and featured in countless
              photographs
            </p>
          </div>
        </div>

        <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-base sm:text-lg h-12 sm:h-14 px-8">
          Explore More
        </button>
      </main>

      <footer className="flex gap-6 flex-wrap items-center justify-center mt-auto">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#learn"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          History
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#gallery"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Gallery
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="#visit"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Visit →
        </a>
      </footer>
    </div>
  );
}
