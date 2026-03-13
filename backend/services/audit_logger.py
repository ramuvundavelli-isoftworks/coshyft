"""
Audit Logger Service
GDPR-compliant audit logging for all data-modifying operations.
"""

from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

from models.audit import AuditLog, GDPRAuditLog


async def log_action(
    session: AsyncSession,
    user_id: str,
    user_role: str,
    action: str,
    entity_type: str,
    entity_id: str,
    description: Optional[str] = None,
    changes: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> AuditLog:
    """Log a general audit event."""
    log = AuditLog(
        user_id=user_id,
        user_role=user_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description,
        changes=changes,
        ip_address=ip_address,
        user_agent=user_agent,
        timestamp=datetime.utcnow(),
    )
    session.add(log)
    await session.flush()
    return log


async def log_gdpr_action(
    session: AsyncSession,
    user_id: str,
    user_role: str,
    action: str,
    entity_type: str,
    entity_id: str,
    changes: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None,
    gdpr_basis: Optional[str] = None,
    data_retention_date: Optional[datetime] = None,
    region: Optional[str] = None,
) -> GDPRAuditLog:
    """Log a GDPR-specific audit event."""
    log = GDPRAuditLog(
        user_id=user_id,
        user_role=user_role,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        changes=changes,
        ip_address=ip_address,
        gdpr_basis=gdpr_basis,
        data_retention_date=data_retention_date,
        region=region,
        timestamp=datetime.utcnow(),
    )
    session.add(log)
    await session.flush()
    return log


def sanitize_changes_for_log(
    old_data: Dict[str, Any],
    new_data: Dict[str, Any],
    sensitive_fields: Optional[list] = None,
) -> Dict[str, Dict[str, Any]]:
    """
    Create a diff of changes, redacting sensitive fields.
    Returns { field_name: { old: ..., new: ... } }
    """
    if sensitive_fields is None:
        sensitive_fields = ["hashed_password", "ip_address", "user_agent"]

    changes = {}
    for key in new_data:
        if key in sensitive_fields:
            if old_data.get(key) != new_data[key]:
                changes[key] = {"old": "[REDACTED]", "new": "[REDACTED]"}
        elif old_data.get(key) != new_data[key]:
            changes[key] = {"old": old_data.get(key), "new": new_data[key]}

    return changes
