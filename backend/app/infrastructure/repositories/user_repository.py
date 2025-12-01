from uuid import UUID

from postgrest.exceptions import APIError

from app.domain.entities.user import User, UserCreate
from app.infrastructure.database import get_supabase_client


class UserRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "users"

    async def find_by_id(self, id: UUID) -> User | None:
        response = self.client.table(self.table).select("*").eq("id", str(id)).execute()
        if response.data:
            return User(**response.data[0])
        return None

    async def find_by_clerk_id(self, clerk_id: str) -> User | None:
        response = self.client.table(self.table).select("*").eq("clerk_id", clerk_id).execute()
        if response.data:
            return User(**response.data[0])
        return None

    async def find_by_email(self, email: str) -> User | None:
        response = self.client.table(self.table).select("*").eq("email", email).execute()
        if response.data:
            return User(**response.data[0])
        return None

    async def find_all(self) -> list[User]:
        response = self.client.table(self.table).select("*").execute()
        return [User(**row) for row in response.data]

    async def create(self, user: User) -> User:
        data = user.model_dump(mode="json", exclude_none=True)
        response = self.client.table(self.table).insert(data).execute()
        return User(**response.data[0])

    async def create_from_clerk(self, user_data: UserCreate) -> User:
        data = user_data.model_dump(mode="json")
        try:
            response = self.client.table(self.table).insert(data).execute()
            return User(**response.data[0])
        except APIError as e:
            if "23505" in str(e):
                existing = await self.find_by_clerk_id(user_data.clerk_id)
                if existing:
                    return existing
                existing_by_email = await self.find_by_email(user_data.email)
                if existing_by_email:
                    update_data = {"clerk_id": user_data.clerk_id, "name": user_data.name}
                    response = (
                        self.client.table(self.table)
                        .update(update_data)
                        .eq("email", user_data.email)
                        .execute()
                    )
                    return User(**response.data[0])
            raise

    async def upsert_from_clerk(self, user_data: UserCreate) -> User:
        """clerk_idをキーにしてupsertする"""
        data = user_data.model_dump(mode="json")
        response = (
            self.client.table(self.table)
            .upsert(data, on_conflict="clerk_id")
            .execute()
        )
        return User(**response.data[0])

    async def update(self, user: User) -> User:
        data = user.model_dump(mode="json", exclude_none=True)
        response = (
            self.client.table(self.table).update(data).eq("id", str(user.id)).execute()
        )
        return User(**response.data[0])
