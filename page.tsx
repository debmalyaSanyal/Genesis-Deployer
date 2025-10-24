// File: src/app/page.tsx (Corrected Version)
"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!prompt) {
      setError("Please enter a project description.");
      return;
    }
    setIsLoading(true);
    setError("");
    setRepoUrl("");

    try {
      const response = await fetch("/api/generateAndDeploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setRepoUrl(data.repoUrl);
    } catch (err: unknown) { // <-- FIX 1: Changed 'any' to 'unknown'
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <header className="absolute top-0 right-0 p-6">
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Signed in as {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-semibold bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="px-4 py-2 font-semibold bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            Sign in with GitHub
          </button>
        )}
      </header>

      <main className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-2">Genesis Deployer</h1>
        <p className="text-gray-400 mb-8">Describe your application, and we&apos;ll code and deploy it for you.</p> {/* <-- FIX 2: Changed we'll to we&apos;ll */}

        {session ? (
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A simple portfolio website using React and Tailwind CSS with a section for projects and a contact form."
              className="w-full h-32 p-4 text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Generating & Deploying..." : "Create My App"}
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
            {repoUrl && (
              <div className="mt-6 p-4 bg-green-900/50 border border-green-500 rounded-md">
                <p className="font-semibold">Success! 🚀</p>
                <p>Your project has been created:</p>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {repoUrl}
                </a>
                <p className="text-sm text-gray-400 mt-2">Vercel will automatically start deploying it. Check your Vercel dashboard!</p>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-8 text-lg text-gray-300">Please sign in with GitHub to get started.</p>
        )}
      </main>
    </div>
  );
}