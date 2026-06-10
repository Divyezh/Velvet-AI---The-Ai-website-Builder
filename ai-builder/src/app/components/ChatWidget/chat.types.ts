export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatWidgetProps {
  initialMessage?: string;
  placeholder?: string;
  assistantName?: string;
  onSend?: (message: string) => Promise<string>;
}
