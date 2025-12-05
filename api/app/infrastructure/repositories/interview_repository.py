from uuid import UUID

from app.domain.entities.interview import Interview, InterviewDetail, InterviewQuestionResponse
from app.infrastructure.database import get_supabase_client


class InterviewRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "interviews"

    async def find_by_id(self, id: UUID) -> Interview | None:
        response = self.client.table(self.table).select("*").eq("id", str(id)).execute()
        if response.data:
            return Interview(**response.data[0])
        return None

    async def find_by_candidate_id(self, candidate_id: UUID) -> Interview | None:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("candidate_id", str(candidate_id))
            .execute()
        )
        if response.data:
            return Interview(**response.data[0])
        return None

    async def find_all(self) -> list[Interview]:
        response = (
            self.client.table(self.table)
            .select("*")
            .order("interview_date", desc=True)
            .execute()
        )
        return [Interview(**row) for row in response.data]

    async def create(self, interview: Interview) -> Interview:
        data = interview.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return Interview(**response.data[0])

    async def update(self, interview: Interview) -> Interview:
        data = interview.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(interview.id)).execute()
        )
        return Interview(**response.data[0])


class InterviewDetailRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "interview_details"

    async def find_by_interview_id(self, interview_id: UUID) -> list[InterviewDetail]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("interview_id", str(interview_id))
            .execute()
        )
        return [InterviewDetail(**row) for row in response.data]

    async def upsert(self, detail: InterviewDetail) -> InterviewDetail:
        data = detail.model_dump(mode="json")
        response = self.client.table(self.table).upsert(data).execute()
        return InterviewDetail(**response.data[0])

    async def bulk_upsert(self, details: list[InterviewDetail]) -> list[InterviewDetail]:
        data = [d.model_dump(mode="json") for d in details]
        response = self.client.table(self.table).upsert(data).execute()
        return [InterviewDetail(**row) for row in response.data]


class InterviewQuestionResponseRepository:
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "interview_question_responses"

    async def find_by_interview_id(self, interview_id: UUID) -> list[InterviewQuestionResponse]:
        response = (
            self.client.table(self.table)
            .select("*")
            .eq("interview_id", str(interview_id))
            .order("created_at")
            .execute()
        )
        return [InterviewQuestionResponse(**row) for row in response.data]

    async def create(self, qr: InterviewQuestionResponse) -> InterviewQuestionResponse:
        data = qr.model_dump(mode="json")
        response = self.client.table(self.table).insert(data).execute()
        return InterviewQuestionResponse(**response.data[0])

    async def update(self, qr: InterviewQuestionResponse) -> InterviewQuestionResponse:
        data = qr.model_dump(mode="json")
        response = (
            self.client.table(self.table).update(data).eq("id", str(qr.id)).execute()
        )
        return InterviewQuestionResponse(**response.data[0])

    async def delete(self, id: UUID) -> bool:
        response = self.client.table(self.table).delete().eq("id", str(id)).execute()
        return len(response.data) > 0

