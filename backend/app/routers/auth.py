from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import os

router = APIRouter()


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = ""


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: Optional[str] = None


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    # NOTE: This is a stub - actual auth should go through Supabase
    # The frontend handles Supabase auth directly
    raise HTTPException(
        status_code=501,
        detail="Use Supabase client-side auth. This endpoint is not implemented.",
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(request: SignInRequest):
    # NOTE: This is a stub - actual auth should go through Supabase
    raise HTTPException(
        status_code=501,
        detail="Use Supabase client-side auth. This endpoint is not implemented.",
    )