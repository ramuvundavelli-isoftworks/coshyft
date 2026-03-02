"""
Audit Middleware
Auto-logs all data-modifying requests (POST, PUT, DELETE) for GDPR compliance.
"""

import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class AuditMiddleware(BaseHTTPMiddleware):
    """Middleware to log all API requests for audit trail."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()

        # Add request metadata
        request.state.request_id = f"req-{int(start_time * 1000)}"
        request.state.ip_address = request.client.host if request.client else None

        response = await call_next(request)

        # Log data-modifying requests
        duration = time.time() - start_time
        if request.method in ("POST", "PUT", "DELETE", "PATCH"):
            # In production, write to audit log table or external logging service
            print(
                f"[AUDIT] {request.method} {request.url.path} "
                f"status={response.status_code} duration={duration:.3f}s "
                f"ip={request.state.ip_address}"
            )

        return response
