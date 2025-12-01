from uuid import UUID

from app.domain.entities.agent import Agent
from app.infrastructure.database import get_supabase_client


class AgentRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "agents"

    async def find_by_id(self, id: UUID) -> Agent | None:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("id", str(id))
            .eq("deleted_flag", False)
            .execute()
        )
        if response.data:
            return Agent(**response.data[0])
        return None

    async def find_all(self) -> list[Agent]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("deleted_flag", False)
            .order("company_name")
            .execute()
        )
        return [Agent(**row) for row in response.data]

    async def create(self, agent: Agent) -> Agent:
        data = agent.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return Agent(**response.data[0])

    async def update(self, agent: Agent) -> Agent:
        data = agent.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(agent.id)).execute()
        )
        return Agent(**response.data[0])

    async def delete(self, id: UUID) -> bool:
        response = (
            self.client.table(self.table)
            .update({"deleted_flag": True})
            .eq("id", str(id))
            .execute()
        )
        return len(response.data) > 0

