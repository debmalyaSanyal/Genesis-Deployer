// File: src/app/api/generateAndDeploy/route.ts (Cleaned Version)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import Groq from "groq-sdk";
import { Octokit } from "octokit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const formatRepoName = (prompt: string) => {
  return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-").slice(0, 50);
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // The type error is now gone!
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `You are an expert web developer. Your task is to generate a complete project as a single, minified JSON object. The JSON must have three keys: "packageJson", "appCode", and "readme". The value for each key must be the complete file content as a string. Do not include any text or markdown formatting outside of the JSON object itself.` },
        { role: "user", content: `Generate the files for the following project request: "${prompt}". The appCode should be for a 'app/page.js' file in the Next.js App Router, be a self-contained React application, and use Tailwind CSS. The package.json should include "react", "react-dom", and "next". The README.md should have a title, description, and running instructions.` }
      ],
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) { throw new Error("Groq returned an empty response."); }
    const generatedFiles = JSON.parse(responseText);
    
    // The type error is also gone here!
    const octokit = new Octokit({ auth: session.accessToken });
    
    const repoName = formatRepoName(prompt);
    const { data: { login } } = await octokit.rest.users.getAuthenticated();
    const repo = await octokit.rest.repos.createForAuthenticatedUser({ name: repoName, private: false });
    const repoUrl = repo.data.html_url;

    const commitFile = async (path: string, content: string, message: string) => {
      await octokit.rest.repos.createOrUpdateFileContents({ owner: login, repo: repoName, path, message, content: Buffer.from(content).toString("base64") });
    };
    
    await commitFile("package.json", generatedFiles.packageJson, "feat: add package.json");
    await commitFile("app/page.js", generatedFiles.appCode, "feat: add initial application code");
    await commitFile("README.md", generatedFiles.readme, "docs: add README file");

    return NextResponse.json({ repoUrl: repoUrl });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate and deploy project." }, { status: 500 });
  }
}