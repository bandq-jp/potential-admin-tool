from uuid import UUID

from app.domain.entities.criteria import CriteriaGroup, CriteriaItem
from app.infrastructure.database import get_supabase_client


class CriteriaGroupRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "criteria_groups"

    async def find_by_id(self, id: UUID) -> CriteriaGroup | None:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("id", str(id))
            .eq("deleted_flag", False)
            .execute()
        )
        if response.data:
            return CriteriaGroup(**response.data[0])
        return None

    async def find_by_job_position_id(self, job_position_id: UUID) -> list[CriteriaGroup]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("job_position_id", str(job_position_id))
            .eq("deleted_flag", False)
            .order("sort_order")
            .execute()
        )
        return [CriteriaGroup(**row) for row in response.data]

    async def create(self, group: CriteriaGroup) -> CriteriaGroup:
        data = group.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return CriteriaGroup(**response.data[0])

    async def update(self, group: CriteriaGroup) -> CriteriaGroup:
        data = group.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(group.id)).execute()
        )
        return CriteriaGroup(**response.data[0])

    async def delete(self, id: UUID) -> bool:
        response = (
            self.client.table(self.table)
            .update({"deleted_flag": True})
            .eq("id", str(id))
            .execute()
        )
        return len(response.data) > 0


class CriteriaItemRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "criteria_items"

    async def find_by_id(self, id: UUID) -> CriteriaItem | None:
        response = self.client.table(self.table).select("*").eq("id", str(id)).execute()
        if response.data:
            return CriteriaItem(**response.data[0])
        return None

    async def find_by_group_id(self, criteria_group_id: UUID) -> list[CriteriaItem]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("criteria_group_id", str(criteria_group_id))
            .order("sort_order")
            .execute()
        )
        return [CriteriaItem(**row) for row in response.data]

    async def find_by_job_position_id(self, job_position_id: UUID) -> list[CriteriaItem]:
        response = (
            self.client.table(self.table)
            .select("*, criteria_groups!inner(job_position_id)")
            .eq("criteria_groups.job_position_id", str(job_position_id))
            .order("sort_order")
            .execute()
        )
        return [CriteriaItem(**{k: v for k, v in row.items() if k != "criteria_groups"}) for row in response.data]

    async def create(self, item: CriteriaItem) -> CriteriaItem:
        data = item.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return CriteriaItem(**response.data[0])

    async def update(self, item: CriteriaItem) -> CriteriaItem:
        data = item.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(item.id)).execute()
        )
        return CriteriaItem(**response.data[0])

