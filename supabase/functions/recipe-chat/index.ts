import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateRecipeImage(recipeName: string, apiKey: string): Promise<string | null> {
  try {
    const prompt = `Professional food photography of ${recipeName}, Tamil cuisine, beautifully plated on traditional banana leaf, vibrant colors, natural lighting, appetizing, high quality, 4k`;
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      console.error("Image generation failed:", response.status);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return imageUrl || null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert Tamil Nadu cuisine chef and recipe advisor. Your name is "AI Aachi" (AI Grandma).

Your expertise includes traditional South Indian dishes like:
- Breakfast: Dosa (all varieties), Idli, Pongal, Upma, Vada
- Main dishes: Sambar, Rasam, Kootu, Poriyal, Kurma
- Rice varieties: Lemon rice, Curd rice, Tamarind rice, Coconut rice
- Sweets: Payasam, Ladoo, Mysore Pak, Halwa

CRITICAL RULES:
1. When users provide specific ingredients, ONLY use those ingredients in your recipes
2. DO NOT suggest adding extra ingredients unless the user asks
3. If the provided ingredients are insufficient for a complete dish, explain what's missing
4. Suggest ONE recipe at a time with complete step-by-step instructions
5. Start each recipe response with the exact recipe name on the first line (e.g., "Masala Dosa" or "Sambar")
6. Include cooking times and serving sizes
7. Use friendly Tanglish (Tamil-English mix) phrases naturally

Format your recipe responses like this:
[Recipe Name]

Ingredients:
- List all ingredients with measurements

Step-by-step Instructions:
1. First step
2. Second step
(continue...)

Cooking Time: X minutes
Serves: Y people

Tips: Add helpful cooking tips`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    // Create a transform stream to inject image generation
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let fullResponse = "";
    let imageGenerated = false;

    (async () => {
      try {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullResponse += chunk;

          // Forward the chunk to the client
          await writer.write(encoder.encode(chunk));

          // Check if we have enough content to extract recipe name and generate image
          if (!imageGenerated && fullResponse.includes("data: ") && fullResponse.length > 100) {
            const lines = fullResponse.split("\n");
            let recipeContent = "";
            
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices?.[0]?.delta?.content;
                  if (content) recipeContent += content;
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }

            // Extract recipe name (first line of content)
            const firstLine = recipeContent.split('\n')[0]?.trim();
            if (firstLine && firstLine.length > 3 && firstLine.length < 50) {
              imageGenerated = true;
              console.log("Generating image for recipe:", firstLine);
              
              // Generate image in background
              generateRecipeImage(firstLine, LOVABLE_API_KEY).then(async (imageUrl) => {
                if (imageUrl) {
                  // Send image as a special event
                  const imageEvent = `data: ${JSON.stringify({
                    choices: [{
                      delta: {
                        role: "assistant",
                        image: imageUrl
                      }
                    }]
                  })}\n\n`;
                  await writer.write(encoder.encode(imageEvent));
                }
              }).catch(err => console.error("Image generation error:", err));
            }
          }
        }

        await writer.close();
      } catch (error) {
        console.error("Stream error:", error);
        await writer.abort(error);
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Recipe chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
