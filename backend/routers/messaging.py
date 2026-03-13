"""
Messaging Router
GET  /messages/threads, /threads/{id}
POST /messages/threads, /threads/{id}/messages
PUT  /messages/threads/{id}/read, /threads/{id}/pin
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import get_current_user
from models.user import User
from models.messaging import MessageThread, Message, ThreadParticipant
from schemas.messaging import ThreadCreate, ThreadRead, MessageSend, MessageRead
from schemas.common import ApiResponse

router = APIRouter(prefix="/messages", tags=["Messaging"])


@router.get("/threads", response_model=ApiResponse)
async def list_threads(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List message threads for current user."""
    # Get threads where user is a participant
    participant_stmt = select(ThreadParticipant.thread_id).where(
        ThreadParticipant.user_id == user.id
    )
    result = await session.execute(participant_stmt)
    thread_ids = [row[0] for row in result.all()]

    if not thread_ids:
        return ApiResponse(success=True, data=[])

    threads = (await session.execute(
        select(MessageThread).where(MessageThread.id.in_(thread_ids))
        .order_by(MessageThread.last_message_at.desc().nullslast())
    )).scalars().all()

    data = []
    for t in threads:
        # Get participants
        participants = (await session.execute(
            select(ThreadParticipant).where(ThreadParticipant.thread_id == t.id)
        )).scalars().all()

        # Get unread count for current user
        user_participant = next((p for p in participants if p.user_id == user.id), None)
        unread = user_participant.unread_count if user_participant else 0

        participant_data = []
        for p in participants:
            p_user = (await session.execute(select(User).where(User.id == p.user_id))).scalar_one_or_none()
            participant_data.append({
                "user_id": p.user_id,
                "name": p_user.name if p_user else "Unknown",
                "role": p.role,
                "is_online": p.is_online,
            })

        data.append({
            **ThreadRead.model_validate(t).model_dump(),
            "unread_count": unread,
            "participants": participant_data,
        })

    return ApiResponse(success=True, data=data)


@router.post("/threads", response_model=ApiResponse[ThreadRead], status_code=201)
async def create_thread(
    data: ThreadCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a new message thread."""
    thread = MessageThread(
        type=data.type,
        title=data.title,
        linked_ride_id=data.linked_ride_id,
    )
    session.add(thread)
    await session.flush()

    # Add current user as participant
    all_ids = list(set([user.id] + data.participant_ids))
    for uid in all_ids:
        p = ThreadParticipant(thread_id=thread.id, user_id=uid)
        session.add(p)

    await session.flush()
    await session.refresh(thread)

    return ApiResponse(success=True, data=ThreadRead.model_validate(thread))


@router.get("/threads/{thread_id}", response_model=ApiResponse)
async def get_thread(
    thread_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get thread with messages."""
    thread = (await session.execute(
        select(MessageThread).where(MessageThread.id == thread_id)
    )).scalar_one_or_none()
    if thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    # Check user is participant
    participant = (await session.execute(
        select(ThreadParticipant).where(
            ThreadParticipant.thread_id == thread_id,
            ThreadParticipant.user_id == user.id,
        )
    )).scalar_one_or_none()
    if participant is None:
        raise HTTPException(status_code=403, detail="Not a participant")

    messages = (await session.execute(
        select(Message).where(Message.thread_id == thread_id)
        .order_by(Message.created_at.asc())
    )).scalars().all()

    return ApiResponse(success=True, data={
        "thread": ThreadRead.model_validate(thread).model_dump(),
        "messages": [MessageRead.model_validate(m).model_dump() for m in messages],
    })


@router.post("/threads/{thread_id}/messages", response_model=ApiResponse[MessageRead], status_code=201)
async def send_message(
    thread_id: str,
    data: MessageSend,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Send a message to a thread."""
    # Verify participant
    participant = (await session.execute(
        select(ThreadParticipant).where(
            ThreadParticipant.thread_id == thread_id,
            ThreadParticipant.user_id == user.id,
        )
    )).scalar_one_or_none()
    if participant is None:
        raise HTTPException(status_code=403, detail="Not a participant")

    msg = Message(
        thread_id=thread_id,
        sender_id=user.id,
        sender_name=user.name,
        content=data.content,
        type=data.type,
        message_metadata=data.metadata,
    )
    session.add(msg)

    # Update thread last message
    thread = (await session.execute(
        select(MessageThread).where(MessageThread.id == thread_id)
    )).scalar_one()
    thread.last_message_at = datetime.utcnow()
    thread.last_message_preview = data.content[:200]
    thread.updated_at = datetime.utcnow()
    session.add(thread)

    # Increment unread for other participants
    other_participants = (await session.execute(
        select(ThreadParticipant).where(
            ThreadParticipant.thread_id == thread_id,
            ThreadParticipant.user_id != user.id,
        )
    )).scalars().all()
    for p in other_participants:
        p.unread_count += 1
        session.add(p)

    await session.flush()
    await session.refresh(msg)

    return ApiResponse(success=True, data=MessageRead.model_validate(msg))


@router.put("/threads/{thread_id}/read", response_model=ApiResponse)
async def mark_read(
    thread_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Mark thread as read."""
    participant = (await session.execute(
        select(ThreadParticipant).where(
            ThreadParticipant.thread_id == thread_id,
            ThreadParticipant.user_id == user.id,
        )
    )).scalar_one_or_none()
    if participant is None:
        raise HTTPException(status_code=403, detail="Not a participant")

    participant.unread_count = 0
    session.add(participant)

    return ApiResponse(success=True, meta={"message": "Thread marked as read"})


@router.put("/threads/{thread_id}/pin", response_model=ApiResponse)
async def toggle_pin(
    thread_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Toggle pin on thread."""
    thread = (await session.execute(
        select(MessageThread).where(MessageThread.id == thread_id)
    )).scalar_one_or_none()
    if thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")

    thread.is_pinned = not thread.is_pinned
    session.add(thread)

    return ApiResponse(success=True, meta={"message": f"Thread {'pinned' if thread.is_pinned else 'unpinned'}"})
