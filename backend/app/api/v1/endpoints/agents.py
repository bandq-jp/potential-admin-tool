from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.application.dto.agent import AgentCreate, AgentResponse, AgentStats, AgentUpdate
from app.application.services.agent_service import AgentService
from app.core.deps import AdminUser, InternalUser

router = APIRouter()


@router.get("", response_model=list[AgentResponse])
async def list_agents(_: InternalUser):
    service = AgentService()
    return await service.get_all()


@router.get("/stats", response_model=list[AgentStats])
async def get_agent_stats(_: InternalUser):
    service = AgentService()
    return await service.get_stats()


@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: UUID, _: InternalUser):
    service = AgentService()
    agent = await service.get_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.post("", response_model=AgentResponse)
async def create_agent(data: AgentCreate, _: AdminUser):
    service = AgentService()
    return await service.create(data)


@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: UUID, data: AgentUpdate, _: AdminUser):
    service = AgentService()
    agent = await service.update(agent_id, data)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.delete("/{agent_id}")
async def delete_agent(agent_id: UUID, _: AdminUser):
    service = AgentService()
    result = await service.delete(agent_id)
    if not result:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted"}
