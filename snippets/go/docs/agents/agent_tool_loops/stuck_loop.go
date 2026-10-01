package agent_tool_loops

import "slices"

func stuckLoop(iterations int, lastThreeTools []string, prevTool string) bool {
	done := false
	// !snippet:start
	allSame := !slices.ContainsFunc(lastThreeTools, func(t string) bool { return t != prevTool })
	if iterations > 3 && allSame {
		done = true
	}
	// !snippet:end
	return done
}
