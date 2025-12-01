from uuid import UUID

from app.domain.entities.user import User
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

    async def find_all(self) -> list[User]:
        response = self.client.table(self.table).select("*").execute()
        return [User(**row) for row in response.data]

    async def create(self, user: User) -> User:
        data = user.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return User(**response.data[0])

    async def update(self, user: User) -> User:
        data = user.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(user.id)).execute()
        )
        return User(**response.data[0])

