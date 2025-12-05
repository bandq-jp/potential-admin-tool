from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.criteria import (
    CriteriaGroupCreate,
    CriteriaGroupResponse,
    CriteriaGroupUpdate,
    CriteriaGroupWithItems,
    CriteriaItemCreate,
    CriteriaItemResponse,
    CriteriaItemUpdate,
)
from app.application.services.criteria_service import CriteriaService
from app.core.deps import AdminUser, CurrentUser

router = APIRouter()


@router.get("/groups", response_model=list[CriteriaGroupResponse])
async def list_criteria_groups(job_position_id: UUID, _: CurrentUser):
    service = CriteriaService()
    return await service.get_groups_by_position(job_position_id)


@router.get("/groups/with-items", response_model=list[CriteriaGroupWithItems])
async def list_criteria_groups_with_items(job_position_id: UUID, _: CurrentUser):
    service = CriteriaService()
    return await service.get_groups_with_items(job_position_id)


@router.post("/groups", response_model=CriteriaGroupResponse)
async def create_criteria_group(data: CriteriaGroupCreate, _: AdminUser):
    service = CriteriaService()
    return await service.create_group(data)


@router.patch("/groups/{group_id}", response_model=CriteriaGroupResponse)
async def update_criteria_group(group_id: UUID, data: CriteriaGroupUpdate, _: AdminUser):
    service = CriteriaService()
    group = await service.update_group(group_id, data)
    if not group:
        raise HTTPException(status_code=404, detail="Criteria group not found")
    return group


@router.delete("/groups/{group_id}")
async def delete_criteria_group(group_id: UUID, _: AdminUser):
    service = CriteriaService()
    result = await service.delete_group(group_id)
    if not result:
        raise HTTPException(status_code=404, detail="Criteria group not found")
    return {"message": "Criteria group deleted"}


@router.get("/items", response_model=list[CriteriaItemResponse])
async def list_criteria_items(criteria_group_id: UUID, _: CurrentUser):
    service = CriteriaService()
    return await service.get_items_by_group(criteria_group_id)


@router.post("/items", response_model=CriteriaItemResponse)
async def create_criteria_item(data: CriteriaItemCreate, _: AdminUser):
    service = CriteriaService()
    return await service.create_item(data)


@router.patch("/items/{item_id}", response_model=CriteriaItemResponse)
async def update_criteria_item(item_id: UUID, data: CriteriaItemUpdate, _: AdminUser):
    service = CriteriaService()
    item = await service.update_item(item_id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Criteria item not found")
    return item

