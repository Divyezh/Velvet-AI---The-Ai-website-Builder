export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isGenerating?: boolean;
  phase?: string;
  toolsUsed?: number;
  planSteps?: PlanStep[];
  isError?: boolean;
}

export interface PlanStep {
  id: string;
  text: string;
  status: 'pending' | 'current' | 'done';
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isStreaming?: boolean;
}

export interface IDEState {
  // Sandbox
  sandboxId: string | null;
  sandboxStatus: "creating" | "ready" | "error";
  previewUrl: string;

  // UI
  activeView: "app" | "code";
  activeIconPanel: "explorer" | "search" | "git" | null;

  // Chat
  messages: Message[];
  inputValue: string;
  isGenerating: boolean;
  generatingPhase: string;
  toolsUsed: number;
  planSteps: PlanStep[];

  // Editor
  openFiles: string[];           // list of open tab paths
  activeFile: string | null;     // currently shown in editor
  fileContents: Record<string, string>;  // path → content

  // File tree
  fileTree: FileNode[];
  expandedFolders: Set<string>;
  streamingFile: string | null;  // file currently being written by AI

  // Terminal
  terminalInstance: any | null;  // xterm instance
  terminalLines: string[];
  activeTerminalTab: number;

  // Actions
  setSandboxStatus: (status: "creating" | "ready" | "error") => void;
  setSandboxId: (id: string | null) => void;
  setPreviewUrl: (url: string) => void;
  setActiveView: (view: "app" | "code") => void;
  setActiveIconPanel: (panel: IDEState['activeIconPanel']) => void;
  setInputValue: (value: string) => void;
  addMessage: (msg: Message) => void;
  updateLastMessage: (updates: Partial<Message>) => void;
  setGenerating: (generating: boolean) => void;
  setGeneratingPhase: (phase: string) => void;
  setToolsUsed: (count: number) => void;
  setPlanSteps: (steps: PlanStep[]) => void;
  openFile: (path: string, content?: string) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string | null) => void;
  updateFileContent: (path: string, content: string) => void;
  setFileTree: (tree: FileNode[]) => void;
  toggleFolder: (path: string) => void;
  setStreamingFile: (path: string | null) => void;
  setTerminalInstance: (instance: any) => void;
  addTerminalLine: (line: string) => void;
  setActiveTerminalTab: (tab: number) => void;
}
