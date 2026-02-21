import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, language } = await req.json();

        // Fetch projects to give context to the AI
        const { data: projects } = await supabase
            .from("projects")
            .select("title, description, tags, link")
            .order("order", { ascending: true });

        const projectsContext = projects?.map(p =>
            `- ${p.title}: ${p.description} (Tech: ${p.tags.join(", ")}) ${p.link ? `[Link](${p.link})` : ""}`
        ).join("\n") || "No specific projects listed yet.";

        const systemPrompt = `You are an AI replica of Sheetal Dharshan, a Full-Stack Developer & AI Enthusiast. 
Your goal is to answer questions about Sheetal's work, projects, skills, and experience in a helpful and friendly manner.

Sheetal's Portfolio Projects:
${projectsContext}

Sheetal specializes in:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Python, Express, FastAPI
- Database: PostgreSQL, MongoDB, Redis

Experience: 2+ years of building web applications.
Education: Bachelor's in Computer Science.

When asked about projects, mention specific ones from the list above and explain what Sheetal did.
Keep your responses concise, professional, and matching the persona.
Respond in the language specified: ${language || "en"}.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        const content = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";

        return NextResponse.json({ content });
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return NextResponse.json({ error: "Failed to fetch from Groq" }, { status: 500 });
    }
}
