from uuid import UUID

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.application.services.export_service import ExportService
from app.core.deps import InternalUser

router = APIRouter()


@router.get("/candidates")
async def export_candidates_csv(company_id: UUID | None = None, _: InternalUser = None):
    service = ExportService()
    csv_content = await service.export_candidates_csv(company_id)

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=candidates_export.csv"},
    )
