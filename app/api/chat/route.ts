import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 60 seconds for complex reasoning
export const maxDuration = 60

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

// Different models for different purposes
const MODELS = {
    fast: "llama-3.1-8b-instant", // Quick responses, casual chat
    reasoning: "llama-3.3-70b-versatile", // Complex analysis, problem-solving
    creative: "qwen/qwen3-32b", // Creative tasks, brainstorming  
}

const SYSTEM_PROMPT = `You are NORA (NCC Online Response AI), an intelligent assistant developed by the Nigerian Communications Commission (NCC). 
Your task is to provide clear, helpful, and accurate answers using only the information provided in the system context or trusted internal data. If the answer is not found in the context, you must politely say you don’t have that information and suggest contacting an NCC representative on NCC website: https://www.ncc.gov.ng.
- Use formal but accessible language suitable for the general public in Nigeria.
- Never make up facts or speculate.
- Keep answers concise, focused, and professional.
- Only respond to private or sensitive queries if the system confirms the user's identity has been verified.
- Do not disclose any information that isn’t present in the context.
You must always prioritize clarity, accuracy, and user trust.`;

export async function POST(req: Request) {
  try {
    console.log("=== Chat API Request Started ===")

    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return Response.json({ error: "Invalid request format: Request body must be valid JSON" }, { status: 400 })
    }

    const { messages, mode = "general", provider = "groq", apiKey } = body
    console.log("📝 Request details:", {
      messagesCount: messages?.length || 0,
      mode,
      provider,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasGeminiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      hasUserApiKey: !!apiKey,
      firstMessage: messages?.[0]?.content?.substring(0, 50) + "...",
    })

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid messages:", { messages, type: typeof messages })
      return Response.json({ error: "Invalid messages format: Messages must be a non-empty array" }, { status: 400 })
    }

    const systemPrompt = SYSTEM_PROMPT


    // Handle Groq requests (default)
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY environment variable is not set")
      return Response.json({ error: "API configuration error: GROQ_API_KEY is not configured" }, { status: 500 })
    }

    try {
      // Determine which model to use based on the conversation context
      let modelType = "fast"
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

      // Use reasoning model for complex tasks
      if (
        lastMessage.includes("analyze") ||
        lastMessage.includes("compare") ||
        lastMessage.includes("plan") ||
        lastMessage.includes("strategy") ||
        lastMessage.includes("decision") ||
        lastMessage.includes("problem")
      ) {
        modelType = "reasoning"
      }

      // Use creative model for creative tasks
      if (
        lastMessage.includes("creative") ||
        lastMessage.includes("brainstorm") ||
        lastMessage.includes("idea") ||
        lastMessage.includes("write") ||
        lastMessage.includes("design") ||
        lastMessage.includes("story")
      ) {
        modelType = "creative"
      }

      const selectedModel = MODELS[modelType as keyof typeof MODELS]

      console.log("AI Configuration:", {
        mode,
        modelType,
        selectedModel,
        systemPromptLength: systemPrompt.length,
      })

      // Create the AI request
      const result = await streamText({
        model: groq(selectedModel),
        system: systemPrompt,
        messages,
        temperature: modelType === "creative" ? 0.8 : mode === "bff" ? 0.9 : 0.7,
        maxTokens: 1000,
      })

      console.log("Groq request successful, streaming response")
      return result.toDataStreamResponse()
    } catch (groqError) {
      console.error("Groq API Error:", groqError)
      return Response.json(
        {
          error: `Groq API Error: ${groqError instanceof Error ? groqError.message : "Unknown error"}`,
        },
        { status: 500 },
      )
    }
    
  } catch (error) {
    console.error("Chat API Error:", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
    })

    return Response.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
