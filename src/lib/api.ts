const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Streaming chat with AI
export async function streamChat({
  messages,
  sessionId,
  token,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  sessionId?: string;
  token: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, sessionId }),
    });

    if (!resp.ok) {
      const error = await resp.json().catch(() => ({ error: "Request failed" }));
      onError(error.error || "Request failed");
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (error) {
    onError(error instanceof Error ? error.message : "Unknown error");
  }
}

// Memory API
export async function storeMemory(token: string, data: {
  content: string;
  sessionId?: string;
  tags?: string[];
  source?: string;
  metadata?: Record<string, any>;
  expiresIn?: number;
}) {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/memory-store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return resp.json();
}

export async function retrieveMemories(token: string, params?: {
  sessionId?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}) {
  const url = new URL(`${SUPABASE_URL}/functions/v1/memory-retrieve`);
  if (params?.sessionId) url.searchParams.set("session_id", params.sessionId);
  if (params?.tag) url.searchParams.set("tag", params.tag);
  if (params?.limit) url.searchParams.set("limit", params.limit.toString());
  if (params?.offset) url.searchParams.set("offset", params.offset.toString());

  const resp = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return resp.json();
}

export async function clearMemories(token: string, data?: {
  sessionId?: string;
  memoryId?: string;
}) {
  const resp = await fetch(`${SUPABASE_URL}/functions/v1/memory-clear`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data || {}),
  });
  return resp.json();
}
