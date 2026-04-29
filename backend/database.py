"""
CoShift Database Configuration
SQLModel async engine and session management.
"""

from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text
from config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session():
    """FastAPI dependency: yields an async DB session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables on startup, then apply any missing columns from schema updates."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

        # Idempotent column additions — safe to run on every start.
        # Required after adding cancellation/rejection reason fields to the models.
        migrations = [
            "ALTER TABLE rides ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(200)",
            "ALTER TABLE rides ADD COLUMN IF NOT EXISTS cancellation_note VARCHAR(500)",
            "ALTER TABLE ride_requests ADD COLUMN IF NOT EXISTS cancellation_reason VARCHAR(200)",
            "ALTER TABLE ride_requests ADD COLUMN IF NOT EXISTS cancellation_note VARCHAR(500)",
            "ALTER TABLE ride_requests ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(200)",
            "ALTER TABLE ride_requests ADD COLUMN IF NOT EXISTS rejection_note VARCHAR(500)",
        ]
        for stmt in migrations:
            await conn.execute(text(stmt))


async def close_db():
    """Dispose engine. Called on app shutdown."""
    await engine.dispose()
