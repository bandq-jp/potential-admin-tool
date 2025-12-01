from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.application.dto.agent import AgentCreate, AgentResponse, AgentStats, AgentUpdate
from app.domain.entities.agent import Agent
from app.infrastructure.repositories.agent_repository import AgentRepository
from app.infrastructure.repositories.candidate_repository import CandidateRepository


class AgentService:
    def __init__(self):
        self.repository = AgentRepository()
        self.candidate_repository = CandidateRepository()

    async def get_all(self) -> list[AgentResponse]:
        agents = await self.repository.find_all()
        return [AgentResponse.model_validate(a.model_dump()) for a in agents]

    async def get_by_id(self, id: UUID) -> AgentResponse | None:
        agent = await self.repository.find_by_id(id)
        if agent:
            return AgentResponse.model_validate(agent.model_dump())
        return None

    async def create(self, data: AgentCreate) -> AgentResponse:
        now = datetime.now(timezone.utc)
        agent = Agent(
            id=uuid4(),
            company_name=data.company_name,
            contact_name=data.contact_name,
            contact_email=data.contact_email,
            note=data.note,
            created_at=now,
            updated_at=now,
            deleted_flag=False,
        )
        created = await self.repository.create(agent)
        return AgentResponse.model_validate(created.model_dump())

    async def update(self, id: UUID, data: AgentUpdate) -> AgentResponse | None:
        agent = await self.repository.find_by_id(id)
        if not agent:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(agent, key, value)
        agent.updated_at = datetime.now(timezone.utc)

        updated = await self.repository.update(agent)
        return AgentResponse.model_validate(updated.model_dump())

    async def delete(self, id: UUID) -> bool:
        return await self.repository.delete(id)

    async def get_stats(self) -> list[AgentStats]:
        agents = await self.repository.find_all()
        stats_list = []

        for agent in agents:
            candidates = await self.candidate_repository.find_all(agent_id=agent.id)
            total = len(candidates)
            if total == 0:
                stats_list.append(
                    AgentStats(
                        id=agent.id,
                        company_name=agent.company_name,
                        contact_name=agent.contact_name,
                        referral_count=0,
                        stage_0_5_pass_rate=0.0,
                        final_offer_rate=0.0,
                        mismatch_rate=0.0,
                    )
                )
                continue

            stage_0_5_passed = sum(1 for c in candidates if c.stage_0_5_result.value == "passed")
            final_offer = sum(1 for c in candidates if c.stage_final_result.value == "offer")
            mismatch = sum(1 for c in candidates if c.mismatch_flag)

            stats_list.append(
                AgentStats(
                    id=agent.id,
                    company_name=agent.company_name,
                    contact_name=agent.contact_name,
                    referral_count=total,
                    stage_0_5_pass_rate=round(stage_0_5_passed / total * 100, 1),
                    final_offer_rate=round(final_offer / total * 100, 1),
                    mismatch_rate=round(mismatch / total * 100, 1),
                )
            )

        return stats_list

