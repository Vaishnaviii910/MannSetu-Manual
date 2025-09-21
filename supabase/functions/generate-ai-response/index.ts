import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0";

// Define a single, static prompt for a supportive mental health assistant
const SYSTEM_PROMPT = `You are MannMitra, an empathetic and supportive AI assistant for a mental wellness platform for university students. Focus only on mental health concerns such as stress, anxiety, low mood, and related issues. Always respond in a caring, understanding, and useful way that matches the user’s needs, instead of giving the same type of response every time. Encourage users to connect with a counselor if they need more support. Do not diagnose or give medical advice, and politely steer the conversation back if the user asks about unrelated topics. Keep a soothing and professional tone, and the response should not be longer than 5-7 lines. Try to make the person calm, and give steps to resolve his problem`;

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

serve(async (req) => {
  // Handle preflight requests for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }
  
  const authHeader = req.headers.get("Authorization");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    {
      global: {
        headers: {
          Authorization: authHeader!,
        },
      },
      auth: {
          persistSession: false
      },
    }
  );

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  
  const { prompt, user_id } = await req.json();
  
  if (!prompt || !user_id) {
    return new Response("Missing prompt or user_id", { status: 400 });
  }
  
  if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY secret.");
      return new Response(JSON.stringify({ error: "Missing API key configuration." }), {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
  }

  try {
    // Save the user's message to chat history
    const { error: userInsertError } = await supabase
      .from("chat_history")
      .insert({
        user_id: user_id,
        message: prompt,
        sender: "user",
      });
    
    if (userInsertError) {
      console.error("Error saving user message to DB:", userInsertError);
    }
    
    // Prepare the request to the Gemini API
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${prompt}` }] }],
      }),
    });
    
    if (!geminiResponse.ok) {
      throw new Error(`API call failed: ${geminiResponse.statusText}`);
    }
    
    const geminiData = await geminiResponse.json();
    const botText = geminiData.candidates[0].content.parts[0].text;

    // Save the bot's response to chat history
    const { error: botInsertError } = await supabase
      .from("chat_history")
      .insert({
        user_id: user_id,
        message: botText,
        sender: "bot",
      });
      
    if (botInsertError) {
      console.error("Error saving bot message to DB:", botInsertError);
    }

    return new Response(JSON.stringify({ text: botText }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});