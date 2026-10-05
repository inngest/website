# !snippet:start
# ❌ Bad — relies on context the sub-agent doesn't have
bad = {"task": "Summarize what we discussed above"}

# ✅ Good — self-contained with all necessary context
good = {
    "task": (
        "Summarize the key findings from the Q4 2025 revenue report. "
        "Focus on: 1) YoY growth rate, 2) top performing segments, "
        "3) areas of concern."
    )
}
# !snippet:end
