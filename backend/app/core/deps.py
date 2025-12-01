from typing import Annotated, Optional
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
import httpx

from app.core.config import Settings, get_settings
from app.domain.entities.user import User, UserRole, UserCreate
from app.infrastructure.repositories.user_repository import UserRepository

security = HTTPBearer(auto_error=False)

_jwks_cache: Optional[dict] = None


async def get_clerk_jwks(issuer: str) -> dict:
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    jwks_url = f"{issuer}/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(jwks_url)
            response.raise_for_status()
            _jwks_cache = response.json()
            return _jwks_cache
        except Exception:
            return {"keys": []}


def get_public_key_from_jwks(jwks: dict, kid: str) -> Optional[dict]:
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    return jwks.get("keys", [None])[0] if jwks.get("keys") else None


async def get_clerk_user_info(clerk_user_id: str, secret_key: str) -> dict:
    """Clerk Backend APIからユーザー情報を取得"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"https://api.clerk.com/v1/users/{clerk_user_id}",
                headers={"Authorization": f"Bearer {secret_key}"},
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching Clerk user: {e}")
            return {}


async def get_current_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> User:
    if settings.debug and credentials is None:
        return User(
            id=uuid4(),
            clerk_id="dev-clerk-id",
            email="dev@example.com",
            name="開発ユーザー",
            role=UserRole.ADMIN,
        )

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    token = credentials.credentials

    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")

        if settings.clerk_jwt_issuer:
            jwks = await get_clerk_jwks(settings.clerk_jwt_issuer)
            public_key = get_public_key_from_jwks(jwks, kid)

            if public_key is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not find public key",
                )

            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                options={"verify_aud": False},
            )
        else:
            payload = jwt.decode(
                token,
                options={"verify_signature": False},
            )

        clerk_user_id: str = payload.get("sub")
        if clerk_user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
        )

    user_repo = UserRepository()
    user = await user_repo.find_by_clerk_id(clerk_user_id)

    if user is None:
        clerk_user = await get_clerk_user_info(clerk_user_id, settings.clerk_secret_key)
        
        email = None
        if clerk_user.get("email_addresses"):
            for email_obj in clerk_user.get("email_addresses", []):
                if email_obj.get("id") == clerk_user.get("primary_email_address_id"):
                    email = email_obj.get("email_address")
                    break
            if email is None and clerk_user.get("email_addresses"):
                email = clerk_user["email_addresses"][0].get("email_address")
        
        if email is None:
            email = f"{clerk_user_id}@clerk.local"
        
        first_name = clerk_user.get("first_name", "") or ""
        last_name = clerk_user.get("last_name", "") or ""
        name = f"{first_name} {last_name}".strip() or "ユーザー"

        all_users = await user_repo.find_all()
        role = UserRole.ADMIN if len(all_users) == 0 else UserRole.INTERVIEWER

        new_user = UserCreate(
            clerk_id=clerk_user_id,
            email=email,
            name=name,
            role=role,
        )
        
        try:
            user = await user_repo.create_from_clerk(new_user)
        except Exception as e:
            user = await user_repo.find_by_clerk_id(clerk_user_id)
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create user: {str(e)}",
                )

    return user


async def require_admin(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


CurrentUser = Annotated[User, Depends(get_current_user)]
AdminUser = Annotated[User, Depends(require_admin)]
