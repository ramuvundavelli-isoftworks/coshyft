"""
CoShift FastAPI Application
Scope 3 Category 7 Employee Commuting Intelligence Platform
CSRD/ESRS E1 Compliant | Irish Operations Focus
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db, close_db
from middleware.audit_middleware import AuditMiddleware
from middleware.rate_limiter import RateLimiterMiddleware

# Import all routers
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.commute import router as commute_router
from routers.emissions import router as emissions_router
from routers.carpooling import router as carpooling_router
from routers.admin import router as admin_router
from routers.sustainability import router as sustainability_router
from routers.auditor import router as auditor_router
from routers.superadmin import router as superadmin_router
from routers.gamification import router as gamification_router
from routers.messaging import router as messaging_router
from routers.alerts import router as alerts_router
from routers.emission_factors import router as emission_factors_router
from routers.reporting import router as reporting_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    await init_db()
    print("Database initialized")
    yield
    # Shutdown
    await close_db()
    print("Database connection closed")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Enterprise Scope 3 Category 7 Employee Commuting Intelligence Platform. "
        "CSRD/ESRS E1 compliant. Irish operations focus with SEAI 2024 emission factors."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# --- Middleware ---
# Note: middlewares are applied in reverse order (last added = outermost = first to run).
# CORS must be outermost so it always sets headers, even when inner middleware raises.

# Audit Logging (innermost)
app.add_middleware(AuditMiddleware)

# Rate Limiter
app.add_middleware(RateLimiterMiddleware)

# CORS (outermost — added last so it runs first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Routers ---

app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
app.include_router(commute_router, prefix=settings.API_V1_PREFIX)
app.include_router(emissions_router, prefix=settings.API_V1_PREFIX)
app.include_router(carpooling_router, prefix=settings.API_V1_PREFIX)
app.include_router(admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(sustainability_router, prefix=settings.API_V1_PREFIX)
app.include_router(auditor_router, prefix=settings.API_V1_PREFIX)
app.include_router(superadmin_router, prefix=settings.API_V1_PREFIX)
app.include_router(gamification_router, prefix=settings.API_V1_PREFIX)
app.include_router(messaging_router, prefix=settings.API_V1_PREFIX)
app.include_router(alerts_router, prefix=settings.API_V1_PREFIX)
app.include_router(emission_factors_router, prefix=settings.API_V1_PREFIX)
app.include_router(reporting_router, prefix=settings.API_V1_PREFIX)


# --- Health Check ---

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/api/docs",
        "api": f"{settings.API_V1_PREFIX}",
    }
