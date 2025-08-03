from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from core.auth import get_current_user, get_or_create_user_settings
from models.user_model import User
from models.user_settings_model import UserSettings
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/user-settings", tags=["User Settings"])

class UserSettingsRequest(BaseModel):
    theme: Optional[str] = None
    currency: Optional[str] = None

class UserSettingsResponse(BaseModel):
    theme: str
    currency: str

@router.get("/", response_model=UserSettingsResponse)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user settings"""
    settings = get_or_create_user_settings(db, current_user.id)
    return UserSettingsResponse(
        theme=settings.theme,
        currency=settings.currency
    )

@router.put("/", response_model=UserSettingsResponse)
def update_user_settings(
    settings_data: UserSettingsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user settings"""
    settings = get_or_create_user_settings(db, current_user.id)
    
    if settings_data.theme is not None:
        settings.theme = settings_data.theme
    if settings_data.currency is not None:
        settings.currency = settings_data.currency
    
    db.commit()
    db.refresh(settings)
    
    return UserSettingsResponse(
        theme=settings.theme,
        currency=settings.currency
    ) 