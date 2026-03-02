"""
Authentication Constants
"""

from enum import Enum


class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class UserRole(str, Enum):
    EMPLOYEE = "employee"
    ADMIN = "admin"
    SUSTAINABILITY = "sustainability"
    AUDITOR = "auditor"
    SUPERADMIN = "superadmin"


# Role hierarchy for permission checking (higher index = more access)
ROLE_HIERARCHY = {
    UserRole.EMPLOYEE: 1,
    UserRole.ADMIN: 2,
    UserRole.SUSTAINABILITY: 2,
    UserRole.AUDITOR: 3,
    UserRole.SUPERADMIN: 4,
}
