import { create } from 'zustand';
import { IDEState, Message, PlanStep, FileNode } from '@/types/ide';

export const useIDEStore = create<IDEState>((set) => ({
  sandboxId: null,
  sandboxStatus: "creating",
  previewUrl: "",

  activeView: "app",
  activeIconPanel: "explorer",

  messages: [],
  inputValue: "",
  isGenerating: false,
  generatingPhase: "",
  toolsUsed: 0,
  planSteps: [],

  openFiles: [],
  activeFile: null,
  fileContents: {},

  fileTree: [],
  expandedFolders: new Set<string>(['app', 'apps', 'web', 'src']),
  streamingFile: null,

  terminalInstance: null,
  terminalLines: [],
  activeTerminalTab: 1,

  setSandboxStatus: (status) => set({ sandboxStatus: status }),
  setSandboxId: (id) => set({ sandboxId: id }),
  setPreviewUrl: (url) => set({ previewUrl: url }),
  setActiveView: (view) => set({ activeView: view }),
  setActiveIconPanel: (panel) => set({ activeIconPanel: panel }),
  setInputValue: (value) => set({ inputValue: value }),
  
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateLastMessage: (updates) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], ...updates };
    }
    return { messages: newMessages };
  }),
  
  setGenerating: (generating) => set({ isGenerating: generating }),
  setGeneratingPhase: (phase) => set({ generatingPhase: phase }),
  setToolsUsed: (count) => set({ toolsUsed: count }),
  setPlanSteps: (steps) => set({ planSteps: steps }),

  openFile: (path, content) => set((state) => {
    const newState: Partial<IDEState> = {
      activeFile: path,
      activeView: "code"
    };
    if (!state.openFiles.includes(path)) {
      newState.openFiles = [...state.openFiles, path];
    }
    if (content !== undefined) {
      newState.fileContents = { ...state.fileContents, [path]: content };
    }
    return newState;
  }),
  
  closeFile: (path) => set((state) => {
    const newOpenFiles = state.openFiles.filter(p => p !== path);
    return {
      openFiles: newOpenFiles,
      activeFile: state.activeFile === path ? (newOpenFiles.length > 0 ? newOpenFiles[0] : null) : state.activeFile
    };
  }),
  
  setActiveFile: (path) => set({ activeFile: path, activeView: "code" }),
  updateFileContent: (path, content) => set((state) => ({
    fileContents: { ...state.fileContents, [path]: content }
  })),

  setFileTree: (tree) => set({ fileTree: tree }),
  toggleFolder: (path) => set((state) => {
    const newExpanded = new Set(state.expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    return { expandedFolders: newExpanded };
  }),
  setStreamingFile: (path) => set({ streamingFile: path }),

  setTerminalInstance: (instance) => set({ terminalInstance: instance }),
  addTerminalLine: (line) => set((state) => {
    // Keep max 2000 lines
    const lines = [...state.terminalLines, line];
    if (lines.length > 2000) return { terminalLines: lines.slice(lines.length - 2000) };
    return { terminalLines: lines };
  }),
  setActiveTerminalTab: (tab) => set({ activeTerminalTab: tab }),
}));
