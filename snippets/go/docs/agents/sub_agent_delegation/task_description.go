package sub_agent_delegation

func taskDescriptions() []map[string]any {
	// !snippet:start
	// ❌ Bad — relies on context the sub-agent doesn't have
	bad := map[string]any{"task": "Summarize what we discussed above"}

	// ✅ Good — self-contained with all necessary context
	good := map[string]any{"task": "Summarize the key findings from the Q4 2025 revenue report. Focus on: 1) YoY growth rate, 2) top performing segments, 3) areas of concern."}
	// !snippet:end
	return []map[string]any{bad, good}
}
