from uuid import UUID

from app.domain.entities.company import Company
from app.infrastructure.database import get_supabase_client


class CompanyRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "companies"

    async def find_by_id(self, id: UUID) -> Company | None:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("id", str(id))
            .eq("deleted_flag", False)
            .execute()
        )
        if response.data:
            return Company(**response.data[0])
        return None

    async def find_all(self) -> list[Company]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("deleted_flag", False)
            .order("created_at", desc=True)
            .execute()
        )
        return [Company(**row) for row in response.data]

    async def create(self, company: Company) -> Company:
        data = company.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return Company(**response.data[0])

    async def update(self, company: Company) -> Company:
        data = company.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(company.id)).execute()
        )
        return Company(**response.data[0])

    async def delete(self, id: UUID) -> bool:
        response = (
            self.client.table(self.table)
            .update({"deleted_flag": True})
            .eq("id", str(id))
            .execute()
        )
        return len(response.data) > 0

