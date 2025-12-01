from datetime import date, timedelta
from uuid import UUID

from app.domain.entities.candidate import Candidate
from app.infrastructure.database import get_supabase_client


class CandidateRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "candidates"

    async def find_by_id(self, id: UUID) -> Candidate | None:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("id", str(id))
            .eq("deleted_flag", False)
            .execute()
        )
        if response.data:
            return Candidate(**response.data[0])
        return None

    async def find_all(
        self,
        company_id: UUID | None = None,
        job_position_id: UUID | None = None,
        agent_id: UUID | None = None,
        owner_user_id: UUID | None = None,
    ) -> list[Candidate]:
        query = self.client.table(self.table).select("*").eq("deleted_flag", False)
        if company_id:
            query = query.eq("company_id", str(company_id))
        if job_position_id:
            query = query.eq("job_position_id", str(job_position_id))
        if agent_id:
            query = query.eq("agent_id", str(agent_id))
        if owner_user_id:
            query = query.eq("owner_user_id", str(owner_user_id))
        response = query.order("created_at", desc=True).execute()
        return [Candidate(**row) for row in response.data]

    async def create(self, candidate: Candidate) -> Candidate:
        data = candidate.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return Candidate(**response.data[0])

    async def update(self, candidate: Candidate) -> Candidate:
        data = candidate.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(candidate.id)).execute()
        )
        return Candidate(**response.data[0])

    async def delete(self, id: UUID) -> bool:
        response = (
            self.client.table(self.table)
            .update({"deleted_flag": True})
            .eq("id", str(id))
            .execute()
        )
        return len(response.data) > 0

    async def get_funnel_stats(self, company_id: UUID | None = None) -> dict:
        query = self.client.table(self.table).select("*").eq("deleted_flag", False)
        if company_id:
            query = query.eq("company_id", str(company_id))
        response = query.execute()
        candidates = response.data

        stats = {
            "total": len(candidates),
            "stage_0_5_done": 0,
            "stage_0_5_passed": 0,
            "stage_first_done": 0,
            "stage_first_passed": 0,
            "stage_second_done": 0,
            "stage_second_passed": 0,
            "stage_final_done": 0,
            "stage_final_offer": 0,
            "hired": 0,
            "mismatch": 0,
        }

        for c in candidates:
            if c.get("stage_0_5_result") != "not_done":
                stats["stage_0_5_done"] += 1
            if c.get("stage_0_5_result") == "passed":
                stats["stage_0_5_passed"] += 1
            if c.get("stage_first_result") != "not_done":
                stats["stage_first_done"] += 1
            if c.get("stage_first_result") == "passed":
                stats["stage_first_passed"] += 1
            if c.get("stage_second_result") != "not_done":
                stats["stage_second_done"] += 1
            if c.get("stage_second_result") == "passed":
                stats["stage_second_passed"] += 1
            if c.get("stage_final_result") != "not_done":
                stats["stage_final_done"] += 1
            if c.get("stage_final_result") == "offer":
                stats["stage_final_offer"] += 1
            if c.get("hire_status") == "hired":
                stats["hired"] += 1
            if c.get("mismatch_flag"):
                stats["mismatch"] += 1

        return stats

    async def get_active_candidates_count(self) -> int:
        response = (
            self.client.table(self.table)
            .select("id", count="exact")
            .eq("deleted_flag", False)
            .eq("hire_status", "undecided")
            .neq("stage_final_result", "rejected")
            .execute()
        )
        return response.count or 0

    async def get_pending_interviews_count(self) -> int:
        response = (
            self.client.table(self.table)
            .select("id", count="exact")
            .eq("deleted_flag", False)
            .eq("stage_0_5_result", "not_done")
            .not_.is_("stage_0_5_date", "null")
            .execute()
        )
        return response.count or 0

    async def get_monthly_stats(self, year: int, month: int) -> dict:
        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)

        response = (
            self.client.table(self.table)
            .select("*")
            .eq("deleted_flag", False)
            .gte("created_at", first_day.isoformat())
            .lte("created_at", f"{last_day.isoformat()}T23:59:59")
            .execute()
        )
        candidates = response.data

        hired_response = (
            self.client.table(self.table)
            .select("id", count="exact")
            .eq("deleted_flag", False)
            .eq("hire_status", "hired")
            .gte("updated_at", first_day.isoformat())
            .lte("updated_at", f"{last_day.isoformat()}T23:59:59")
            .execute()
        )

        mismatch_response = (
            self.client.table(self.table)
            .select("id", count="exact")
            .eq("deleted_flag", False)
            .eq("mismatch_flag", True)
            .gte("updated_at", first_day.isoformat())
            .lte("updated_at", f"{last_day.isoformat()}T23:59:59")
            .execute()
        )

        stats = {
            "active_candidates": len(candidates),
            "hired": hired_response.count or 0,
            "mismatch": mismatch_response.count or 0,
            "stage_0_5_done": 0,
            "stage_0_5_passed": 0,
        }

        for c in candidates:
            if c.get("stage_0_5_result") != "not_done":
                stats["stage_0_5_done"] += 1
            if c.get("stage_0_5_result") == "passed":
                stats["stage_0_5_passed"] += 1

        return stats

