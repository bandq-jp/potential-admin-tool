from uuid import UUID

from app.domain.entities.job_position import JobPosition
from app.infrastructure.database import get_supabase_client


class JobPositionRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "job_positions"

    async def find_by_id(self, id: UUID) -> JobPosition | None:
        response = self.client.table(self.table).select("*").eq("id", str(id)).execute()
        if response.data:
            return JobPosition(**response.data[0])
        return None

    async def find_by_company_id(self, company_id: UUID) -> list[JobPosition]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("company_id", str(company_id))
            .order("created_at", desc=True)
            .execute()
        )
        return [JobPosition(**row) for row in response.data]

    async def find_all(self) -> list[JobPosition]:
        response = (
            self.client.table(self.table)
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return [JobPosition(**row) for row in response.data]

    async def create(self, position: JobPosition) -> JobPosition:
        data = position.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return JobPosition(**response.data[0])

    async def update(self, position: JobPosition) -> JobPosition:
        data = position.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(position.id)).execute()
        )
        return JobPosition(**response.data[0])

