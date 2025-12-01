import csv
import io
from uuid import UUID

from app.infrastructure.repositories.agent_repository import AgentRepository
from app.infrastructure.repositories.candidate_repository import CandidateRepository
from app.infrastructure.repositories.company_repository import CompanyRepository
from app.infrastructure.repositories.criteria_repository import (
    CriteriaGroupRepository,
    CriteriaItemRepository,
)
from app.infrastructure.repositories.interview_repository import (
    InterviewDetailRepository,
    InterviewRepository,
)
from app.infrastructure.repositories.job_position_repository import JobPositionRepository
from app.infrastructure.repositories.user_repository import UserRepository


class ExportService:
    def __init__(self):
        self.candidate_repository = CandidateRepository()
        self.company_repository = CompanyRepository()
        self.position_repository = JobPositionRepository()
        self.agent_repository = AgentRepository()
        self.user_repository = UserRepository()
        self.interview_repository = InterviewRepository()
        self.detail_repository = InterviewDetailRepository()
        self.group_repository = CriteriaGroupRepository()
        self.item_repository = CriteriaItemRepository()

    def _score_to_label(self, score: int) -> str:
        labels = {1: "×", 2: "△", 3: "◯", 4: "◎"}
        return labels.get(score, "-")

    async def export_candidates_csv(self, company_id: UUID | None = None) -> str:
        candidates = await self.candidate_repository.find_all(company_id=company_id)

        output = io.StringIO()
        writer = csv.writer(output)

        headers = [
            "候補者ID",
            "氏名",
            "企業名",
            "ポジション名",
            "エージェント会社",
            "エージェント担当",
            "担当者",
            "0.5次結果",
            "0.5次日付",
            "一次結果",
            "一次日付",
            "二次結果",
            "最終結果",
            "最終決定日",
            "入社状況",
            "ミスマッチ",
            "Will（外向き）",
            "アトラクト（外向き）",
        ]
        writer.writerow(headers)

        for c in candidates:
            company = await self.company_repository.find_by_id(c.company_id)
            position = await self.position_repository.find_by_id(c.job_position_id)
            agent = await self.agent_repository.find_by_id(c.agent_id) if c.agent_id else None
            owner = await self.user_repository.find_by_id(c.owner_user_id)
            interview = await self.interview_repository.find_by_candidate_id(c.id)

            will_external = interview.will_text_external if interview else ""
            attract_external = interview.attract_text_external if interview else ""

            row = [
                str(c.id),
                c.name,
                company.name if company else "",
                position.name if position else "",
                agent.company_name if agent else "",
                agent.contact_name if agent else "",
                owner.name if owner else "",
                c.stage_0_5_result.value,
                str(c.stage_0_5_date) if c.stage_0_5_date else "",
                c.stage_first_result.value,
                str(c.stage_first_date) if c.stage_first_date else "",
                c.stage_second_result.value,
                c.stage_final_result.value,
                str(c.stage_final_decision_date) if c.stage_final_decision_date else "",
                c.hire_status.value,
                "あり" if c.mismatch_flag else "",
                will_external or "",
                attract_external or "",
            ]
            writer.writerow(row)

        return output.getvalue()

