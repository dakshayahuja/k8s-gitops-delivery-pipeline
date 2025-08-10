from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from core.auth import verify_google_token, create_jwt_token, get_current_user
from models.user_model import User
from models.user_settings_model import UserSettings
from pydantic import BaseModel
from typing import Optional
from fastapi import Response
import httpx
from fastapi import Query

router = APIRouter(tags=["Authentication"])

class GoogleTokenRequest(BaseModel):
    token: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    picture: Optional[str] = None

@router.post("/google", response_model=AuthResponse)
def google_signin(request: GoogleTokenRequest, db: Session = Depends(get_db)):
    """Sign in with Google token"""
    try:
        # Verify Google token
        user_info = verify_google_token(request.token)

        # Check if user exists
        user = db.query(User).filter(User.google_id == user_info["google_id"]).first()

        if not user:
            # Create new user
            user = User(
                google_id=user_info["google_id"],
                email=user_info["email"],
                name=user_info["name"],
                picture=user_info.get("picture")
            )
            db.add(user)
            db.commit()
            db.refresh(user)

            # Create default user settings
            settings = UserSettings(user_id=user.id)
            db.add(settings)
            db.commit()

        # Create JWT token
        access_token = create_jwt_token(user.id)

        return AuthResponse(
            access_token=access_token,
            user={
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture
            }
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        picture=current_user.picture
    )

@router.post("/logout")
def logout():
    """Logout user (client should remove token)"""
    return {"message": "Logged out successfully"}

@router.get("/proxy-image")
async def proxy_image(url: str = Query(...)):
    """Proxy image to bypass 429 errors on external services"""
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get(url)

        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail="Image fetch failed")

        content_type = r.headers.get("content-type", "image/jpeg")
        return Response(content=r.content, media_type=content_type)