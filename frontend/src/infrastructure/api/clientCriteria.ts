import { api } from '@/lib/api';
import type { CriteriaGroupWithItems } from '@/domain/entities/criteria';

export const clientCriteriaApi = {
  getGroupsWithItems: (jobPositionId: string, token: string) =>
    api.get<CriteriaGroupWithItems[]>(
      `/client/criteria/groups/with-items?job_position_id=${jobPositionId}`,
      token
    ),
};

