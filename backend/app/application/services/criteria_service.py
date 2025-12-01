from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.application.dto.criteria import (
    CriteriaGroupCreate,
    CriteriaGroupResponse,
    CriteriaGroupUpdate,
    CriteriaGroupWithItems,
    CriteriaItemCreate,
    CriteriaItemResponse,
    CriteriaItemUpdate,
)
from app.domain.entities.criteria import CriteriaGroup, CriteriaItem
from app.infrastructure.repositories.criteria_repository import (
    CriteriaGroupRepository,
    CriteriaItemRepository,
)


class CriteriaService:
    def __init__(self):
        self.group_repository = CriteriaGroupRepository()
        self.item_repository = CriteriaItemRepository()

    async def get_groups_by_position(self, job_position_id: UUID) -> list[CriteriaGroupResponse]:
        groups = await self.group_repository.find_by_job_position_id(job_position_id)
        return [CriteriaGroupResponse.model_validate(g.model_dump()) for g in groups]

    async def get_groups_with_items(self, job_position_id: UUID) -> list[CriteriaGroupWithItems]:
        groups = await self.group_repository.find_by_job_position_id(job_position_id)
        result = []
        for group in groups:
            items = await self.item_repository.find_by_group_id(group.id)
            result.append(
                CriteriaGroupWithItems(
                    id=group.id,
                    job_position_id=group.job_position_id,
                    label=group.label,
                    description=group.description,
                    sort_order=group.sort_order,
                    items=[CriteriaItemResponse.model_validate(i.model_dump()) for i in items],
                )
            )
        return result

    async def create_group(self, data: CriteriaGroupCreate) -> CriteriaGroupResponse:
        now = datetime.now(timezone.utc)
        group = CriteriaGroup(
            id=uuid4(),
            job_position_id=data.job_position_id,
            label=data.label,
            description=data.description,
            sort_order=data.sort_order,
            created_at=now,
            updated_at=now,
            deleted_flag=False,
        )
        created = await self.group_repository.create(group)
        return CriteriaGroupResponse.model_validate(created.model_dump())

    async def update_group(self, id: UUID, data: CriteriaGroupUpdate) -> CriteriaGroupResponse | None:
        group = await self.group_repository.find_by_id(id)
        if not group:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(group, key, value)
        group.updated_at = datetime.now(timezone.utc)

        updated = await self.group_repository.update(group)
        return CriteriaGroupResponse.model_validate(updated.model_dump())

    async def delete_group(self, id: UUID) -> bool:
        return await self.group_repository.delete(id)

    async def get_items_by_group(self, criteria_group_id: UUID) -> list[CriteriaItemResponse]:
        items = await self.item_repository.find_by_group_id(criteria_group_id)
        return [CriteriaItemResponse.model_validate(i.model_dump()) for i in items]

    async def create_item(self, data: CriteriaItemCreate) -> CriteriaItemResponse:
        now = datetime.now(timezone.utc)
        item = CriteriaItem(
            id=uuid4(),
            criteria_group_id=data.criteria_group_id,
            label=data.label,
            description=data.description,
            behavior_examples_text=data.behavior_examples_text,
            sort_order=data.sort_order,
            is_active=data.is_active,
            created_at=now,
            updated_at=now,
        )
        created = await self.item_repository.create(item)
        return CriteriaItemResponse.model_validate(created.model_dump())

    async def update_item(self, id: UUID, data: CriteriaItemUpdate) -> CriteriaItemResponse | None:
        item = await self.item_repository.find_by_id(id)
        if not item:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(item, key, value)
        item.updated_at = datetime.now(timezone.utc)

        updated = await self.item_repository.update(item)
        return CriteriaItemResponse.model_validate(updated.model_dump())

