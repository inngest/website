package dependency_injection

import "context"

type AuditLog struct {
	UserID string
	Action string
}

type auditLogTable struct{}

func (auditLogTable) Create(ctx context.Context, a AuditLog) (AuditLog, error) { return a, nil }

type Database struct {
	AuditLog auditLogTable
}

func NewDatabase() *Database { return &Database{} }
