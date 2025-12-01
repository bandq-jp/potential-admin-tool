from uuid import UUID

from app.infrastructure.repositories.candidate_repository import CandidateRepository
from app.infrastructure.repositories.company_repository import CompanyRepository
from app.infrastructure.repositories.criteria_repository import (
    CriteriaGroupRepository,
    CriteriaItemRepository,
)
from app.infrastructure.repositories.interview_repository import (
    InterviewDetailRepository,
    InterviewQuestionResponseRepository,
    InterviewRepository,
)
from app.infrastructure.repositories.job_position_repository import JobPositionRepository


class ReportService:
    def __init__(self):
        self.interview_repository = InterviewRepository()
        self.detail_repository = InterviewDetailRepository()
        self.qr_repository = InterviewQuestionResponseRepository()
        self.candidate_repository = CandidateRepository()
        self.company_repository = CompanyRepository()
        self.position_repository = JobPositionRepository()
        self.group_repository = CriteriaGroupRepository()
        self.item_repository = CriteriaItemRepository()

    def _score_to_label(self, score: int) -> str:
        labels = {1: "×", 2: "△", 3: "◯", 4: "◎"}
        return labels.get(score, "-")

    async def generate_client_report(self, interview_id: UUID) -> str:
        interview = await self.interview_repository.find_by_id(interview_id)
        if not interview:
            return ""

        candidate = await self.candidate_repository.find_by_id(interview.candidate_id)
        if not candidate:
            return ""

        company = await self.company_repository.find_by_id(candidate.company_id)
        position = await self.position_repository.find_by_id(candidate.job_position_id)
        details = await self.detail_repository.find_by_interview_id(interview_id)
        qrs = await self.qr_repository.find_by_interview_id(interview_id)

        groups = await self.group_repository.find_by_job_position_id(candidate.job_position_id)
        items_by_group = {}
        for g in groups:
            items_by_group[g.id] = await self.item_repository.find_by_group_id(g.id)

        details_map = {d.criteria_item_id: d for d in details}

        lines = [
            "# 0.5次面談 評価レポート（クライアント提出用）",
            "",
            "## 候補者情報",
            f"- **氏名**: {candidate.name}",
            f"- **応募企業**: {company.name if company else '-'}",
            f"- **応募ポジション**: {position.name if position else '-'}",
            f"- **面談日**: {interview.interview_date}",
            "",
            "## 総合評価",
            interview.overall_comment_external or "(未入力)",
            "",
            "## 定性要件別評価",
        ]

        for g in groups:
            lines.append(f"\n### {g.label}")
            if g.description:
                lines.append(f"_{g.description}_")
            items = items_by_group.get(g.id, [])
            for item in items:
                detail = details_map.get(item.id)
                score_label = self._score_to_label(detail.score_value) if detail else "-"
                comment = detail.comment_external if detail and detail.comment_external else ""
                lines.append(f"- **{item.label}**: {score_label}")
                if comment:
                    lines.append(f"  - {comment}")

        highlighted_qrs = [q for q in qrs if q.is_highlight]
        if highlighted_qrs:
            lines.append("\n## 主な質問と回答")
            for q in highlighted_qrs:
                lines.append(f"\n**Q: {q.question_text}**")
                if q.answer_summary:
                    lines.append(f"A: {q.answer_summary}")

        if interview.will_text_external:
            lines.append("\n## Will（志向性）")
            lines.append(interview.will_text_external)

        if interview.attract_text_external:
            lines.append("\n## アトラクトポイント")
            lines.append(interview.attract_text_external)

        return "\n".join(lines)

    async def generate_agent_report(self, interview_id: UUID) -> str:
        interview = await self.interview_repository.find_by_id(interview_id)
        if not interview:
            return ""

        candidate = await self.candidate_repository.find_by_id(interview.candidate_id)
        if not candidate:
            return ""

        company = await self.company_repository.find_by_id(candidate.company_id)
        position = await self.position_repository.find_by_id(candidate.job_position_id)
        details = await self.detail_repository.find_by_interview_id(interview_id)

        groups = await self.group_repository.find_by_job_position_id(candidate.job_position_id)
        items_by_group = {}
        for g in groups:
            items_by_group[g.id] = await self.item_repository.find_by_group_id(g.id)

        details_map = {d.criteria_item_id: d for d in details}

        result_text = "通過" if candidate.stage_0_5_result.value == "passed" else "見送り"

        lines = [
            "# 0.5次面談 フィードバック（エージェント向け）",
            "",
            "## 候補者情報",
            f"- **氏名**: {candidate.name}",
            f"- **応募企業**: {company.name if company else '-'}",
            f"- **応募ポジション**: {position.name if position else '-'}",
            f"- **面談日**: {interview.interview_date}",
            f"- **結果**: {result_text}",
            "",
            "## 総合所感",
            interview.overall_comment_external or "(未入力)",
        ]

        low_score_items = []
        for g in groups:
            items = items_by_group.get(g.id, [])
            for item in items:
                detail = details_map.get(item.id)
                if detail and detail.score_value <= 2:
                    low_score_items.append((g.label, item.label, detail))

        if low_score_items:
            lines.append("\n## ギャップのあった要件")
            for group_label, item_label, detail in low_score_items:
                score_label = self._score_to_label(detail.score_value)
                lines.append(f"- **{group_label} / {item_label}**: {score_label}")
                if detail.comment_external:
                    lines.append(f"  - {detail.comment_external}")

        lines.append("\n## 今後のご紹介について")
        lines.append("上記の要件を満たす候補者様のご紹介をお待ちしております。")

        return "\n".join(lines)

