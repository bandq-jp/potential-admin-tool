import { api } from '@/lib/api';
import type {
  CriteriaGroup,
  CriteriaGroupCreate,
  CriteriaGroupWithItems,
  CriteriaItem,
  CriteriaItemCreate,
} from '@/domain/entities/criteria';

export const criteriaApi = {
  getGroups: (jobPositionId: string, token: string) =>
    api.get<CriteriaGroup[]>(`/criteria/groups?job_position_id=${jobPositionId}`, token),

  getGroupsWithItems: (jobPositionId: string, token: string) =>
    api.get<CriteriaGroupWithItems[]>(
      `/criteria/groups/with-items?job_position_id=${jobPositionId}`,
      token
    ),

  createGroup: (data: CriteriaGroupCreate, token: string) =>
    api.post<CriteriaGroup>('/criteria/groups', data, token),

  updateGroup: (id: string, data: Partial<CriteriaGroupCreate>, token: string) =>
    api.patch<CriteriaGroup>(`/criteria/groups/${id}`, data, token),

  deleteGroup: (id: string, token: string) =>
    api.delete<{ message: string }>(`/criteria/groups/${id}`, token),

  getItems: (criteriaGroupId: string, token: string) =>
    api.get<CriteriaItem[]>(`/criteria/items?criteria_group_id=${criteriaGroupId}`, token),

  createItem: (data: CriteriaItemCreate, token: string) =>
    api.post<CriteriaItem>('/criteria/items', data, token),

  updateItem: (id: string, data: Partial<CriteriaItemCreate>, token: string) =>
    api.patch<CriteriaItem>(`/criteria/items/${id}`, data, token),
};

