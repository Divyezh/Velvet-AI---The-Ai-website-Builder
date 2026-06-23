export async function parseStream(
  response: Response,
  onEvent: (event: any) => void
) {
  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim()) {
        try {
          const event = JSON.parse(line);
          onEvent(event);
        } catch (e) {
          console.error("Failed to parse stream event:", line, e);
        }
      }
    }
  }

  // Handle remaining buffer
  if (buffer.trim()) {
    try {
      const event = JSON.parse(buffer);
      onEvent(event);
    } catch (e) {
      // Ignored
    }
  }
}
