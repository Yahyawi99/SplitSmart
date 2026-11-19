import axios from "axios";
import type { GroupsResponse } from "@/types/group";

export async function fetchGroups(page: number) {
  const response = await axios.get<GroupsResponse>(`/api/groups?page=${page}`);
  return response.data;
}
