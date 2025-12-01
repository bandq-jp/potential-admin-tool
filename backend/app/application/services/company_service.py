from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.application.dto.company import CompanyCreate, CompanyResponse, CompanyUpdate
from app.domain.entities.company import Company
from app.infrastructure.repositories.company_repository import CompanyRepository


class CompanyService:
    def __init__(self):
        self.repository = CompanyRepository()

    async def get_all(self) -> list[CompanyResponse]:
        companies = await self.repository.find_all()
        return [CompanyResponse.model_validate(c.model_dump()) for c in companies]

    async def get_by_id(self, id: UUID) -> CompanyResponse | None:
        company = await self.repository.find_by_id(id)
        if company:
            return CompanyResponse.model_validate(company.model_dump())
        return None

    async def create(self, data: CompanyCreate) -> CompanyResponse:
        now = datetime.now(timezone.utc)
        company = Company(
            id=uuid4(),
            name=data.name,
            note=data.note,
            created_at=now,
            updated_at=now,
            deleted_flag=False,
        )
        created = await self.repository.create(company)
        return CompanyResponse.model_validate(created.model_dump())

    async def update(self, id: UUID, data: CompanyUpdate) -> CompanyResponse | None:
        company = await self.repository.find_by_id(id)
        if not company:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(company, key, value)
        company.updated_at = datetime.now(timezone.utc)

        updated = await self.repository.update(company)
        return CompanyResponse.model_validate(updated.model_dump())

    async def delete(self, id: UUID) -> bool:
        return await self.repository.delete(id)

