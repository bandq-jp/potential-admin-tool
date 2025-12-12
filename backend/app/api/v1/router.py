from fastapi import APIRouter

from app.api.v1.endpoints import (
    agents,
    candidates,
    client,
    companies,
    criteria,
    export,
    health,
    interviews,
    job_positions,
    reports,
    users,
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(job_positions.router, prefix="/job-positions", tags=["job-positions"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(criteria.router, prefix="/criteria", tags=["criteria"])
api_router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(export.router, prefix="/export", tags=["export"])
api_router.include_router(client.router, prefix="/client", tags=["client"])
