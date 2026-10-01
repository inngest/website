package human_in_the_loop

import "github.com/inngest/inngestgo"

// ApprovalResponse is the data of an agent/approval.response event.
type ApprovalResponse struct {
	ApprovalID  string `json:"approvalId"`
	Approved    bool   `json:"approved"`
	RespondedBy string `json:"respondedBy"`
	Reason      string `json:"reason,omitempty"`
}

type approvalEvent = inngestgo.GenericEvent[ApprovalResponse]
