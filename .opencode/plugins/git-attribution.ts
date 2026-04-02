import type { Plugin } from "@opencode-ai/plugin"

export const GitAttribution: Plugin = async () => {
  return {
    hook: {
      "tool.execute.after": async (event: any) => {
        if (event?.tool !== "bash") return
        const cmd = event?.args?.command || ""
        if (!cmd.includes("git commit")) return
        if (!cmd.includes("Tool: OpenCode")) {
          console.warn(
            "[git-attribution] Warning: git commit detected without 'Tool: OpenCode' trailer. " +
            "Please include 'Tool: OpenCode (Ollama local)' in commit messages."
          )
        }
      },
    },
  }
}

export default GitAttribution
