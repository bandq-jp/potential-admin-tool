from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.application.dto.candidate import (
    CandidateCreate,
    CandidateResponse,
    CandidateUpdate,
    CandidateWithRelations,
    FunnelStats,
)
from app.domain.entities.candidate import Candidate
from app.infrastructure.repositories.agent_repository import AgentRepository
from app.infrastructure.repositories.candidate_repository import CandidateRepository
from app.infrastructure.repositories.company_repository import CompanyRepository
from app.infrastructure.repositories.job_position_repository import JobPositionRepository
from app.infrastructure.repositories.user_repository import UserRepository


class CandidateService:
    def __init__(self):
        self.repository = CandidateRepository()
        self.company_repository = CompanyRepository()
        self.position_repository = JobPositionRepository()
        self.agent_repository = AgentRepository()
        self.user_repository = UserRepository()

    async def get_all(
        self,
        company_id: UUID | None = None,
        job_position_id: UUID | None = None,
        agent_id: UUID | None = None,
        owner_user_id: UUID | None = None,
    ) -> list[CandidateWithRelations]:
        candidates = await self.repository.find_all(
            company_id=company_id,
            job_position_id=job_position_id,
            agent_id=agent_id,
            owner_user_id=owner_user_id,
        )
        result = []
        for c in candidates:
            company = await self.company_repository.find_by_id(c.company_id)
            position = await self.position_repository.find_by_id(c.job_position_id)
            agent = await self.agent_repository.find_by_id(c.agent_id) if c.agent_id else None
            owner = await self.user_repository.find_by_id(c.owner_user_id)

            result.append(
                CandidateWithRelations(
                    **c.model_dump(),
                    company_name=company.name if company else None,
                    job_position_name=position.name if position else None,
                    agent_company_name=agent.company_name if agent else None,
                    agent_contact_name=agent.contact_name if agent else None,
                    owner_user_name=owner.name if owner else None,
                )
            )
        return result

    async def get_by_id(self, id: UUID) -> CandidateWithRelations | None:
        candidate = await self.repository.find_by_id(id)
        if not candidate:
            return None

        company = await self.company_repository.find_by_id(candidate.company_id)
        position = await self.position_repository.find_by_id(candidate.job_position_id)
        agent = await self.agent_repository.find_by_id(candidate.agent_id) if candidate.agent_id else None
        owner = await self.user_repository.find_by_id(candidate.owner_user_id)

        return CandidateWithRelations(
            **candidate.model_dump(),
            company_name=company.name if company else None,
            job_position_name=position.name if position else None,
            agent_company_name=agent.company_name if agent else None,
            agent_contact_name=agent.contact_name if agent else None,
            owner_user_name=owner.name if owner else None,
        )

    async def create(self, data: CandidateCreate) -> CandidateResponse:
        now = datetime.now(timezone.utc)
        candidate = Candidate(
            id=uuid4(),
            company_id=data.company_id,
            job_position_id=data.job_position_id,
            agent_id=data.agent_id,
            name=data.name,
            resume_url=data.resume_url,
            owner_user_id=data.owner_user_id,
            note=data.note,
            created_at=now,
            updated_at=now,
            deleted_flag=False,
        )
        created = await self.repository.create(candidate)
        return CandidateResponse.model_validate(created.model_dump())

    async def update(self, id: UUID, data: CandidateUpdate) -> CandidateResponse | None:
        candidate = await self.repository.find_by_id(id)
        if not candidate:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(candidate, key, value)
        candidate.updated_at = datetime.now(timezone.utc)

        updated = await self.repository.update(candidate)
        return CandidateResponse.model_validate(updated.model_dump())

    async def delete(self, id: UUID) -> bool:
        return await self.repository.delete(id)

    async def get_funnel_stats(self, company_id: UUID | None = None) -> FunnelStats:
        stats = await self.repository.get_funnel_stats(company_id)
        return FunnelStats(**stats)

