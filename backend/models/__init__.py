"""
CoShift SQLModel ORM Models
Import all models here so Alembic can discover them.
"""

from models.user import User, GDPRConsent, DataRetentionPolicy
from models.commute import CommuteEntry, CommuteProfile
from models.emission import EmissionFactor, EmissionRecord
from models.carpooling import Ride, RideRequest, RecurringRideTemplate, RideException
from models.organization import Office, Baseline, Initiative, Scenario, Risk, Policy
from models.transport import IrishTransportMode, IrishWorkplaceBenefit
from models.audit import AuditLog, GDPRAuditLog, EvidenceItem, AuditFinding, AuditNote
from models.gamification import OxyPointsLedger, UserAchievement, UserBadge, Challenge, ChallengeParticipant
from models.messaging import MessageThread, Message, ThreadParticipant
from models.alert import Alert
from models.report import Report, ReportTemplate, CSRDSubmission
from models.tenant import Tenant, TenantConfig

__all__ = [
    "User", "GDPRConsent", "DataRetentionPolicy",
    "CommuteEntry", "CommuteProfile",
    "EmissionFactor", "EmissionRecord",
    "Ride", "RideRequest", "RecurringRideTemplate", "RideException",
    "Office", "Baseline", "Initiative", "Scenario", "Risk", "Policy",
    "IrishTransportMode", "IrishWorkplaceBenefit",
    "AuditLog", "GDPRAuditLog", "EvidenceItem", "AuditFinding", "AuditNote",
    "OxyPointsLedger", "UserAchievement", "UserBadge", "Challenge", "ChallengeParticipant",
    "MessageThread", "Message", "ThreadParticipant",
    "Alert",
    "Report", "ReportTemplate", "CSRDSubmission",
    "Tenant", "TenantConfig",
]