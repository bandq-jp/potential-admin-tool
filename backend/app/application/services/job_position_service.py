from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.application.dto.job_position import (
    JobPositionCreate,
    JobPositionResponse,
    JobPositionUpdate,
)
from app.domain.entities.job_position import JobPosition
from app.infrastructure.repositories.job_position_repository import JobPositionRepository


class JobPositionService:
    def __init__(self):
        self.repository = JobPositionRepository()

    async def get_all(self) -> list[JobPositionResponse]:
        positions = await self.repository.find_all()
        return [JobPositionResponse.model_validate(p.model_dump()) for p in positions]

    async def get_by_company_id(self, company_id: UUID) -> list[JobPositionResponse]:
        positions = await self.repository.find_by_company_id(company_id)
        return [JobPositionResponse.model_validate(p.model_dump()) for p in positions]

    async def get_by_id(self, id: UUID) -> JobPositionResponse | None:
        position = await self.repository.find_by_id(id)
        if position:
            return JobPositionResponse.model_validate(position.model_dump())
        return None

    async def create(self, data: JobPositionCreate) -> JobPositionResponse:
        now = datetime.now(timezone.utc)
        position = JobPosition(
            id=uuid4(),
            company_id=data.company_id,
            name=data.name,
            description=data.description,
            is_active=data.is_active,
            created_at=now,
            updated_at=now,
        )
        created = await self.repository.create(position)
        return JobPositionResponse.model_validate(created.model_dump())

    async def update(self, id: UUID, data: JobPositionUpdate) -> JobPositionResponse | None:
        position = await self.repository.find_by_id(id)
        if not position:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(position, key, value)
        position.updated_at = datetime.now(timezone.utc)

        updated = await self.repository.update(position)
        return JobPositionResponse.model_validate(updated.model_dump())

