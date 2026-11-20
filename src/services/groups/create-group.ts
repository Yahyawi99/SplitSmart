import axios from "axios";
import type { CreateGroupInput } from "@/types/group";

export async function createGroup(input: CreateGroupInput) {
  const response = await axios.post("/api/groups", {
    name: input.name,
    description: input.description,
    currency: input.currency,
  });
  return response.data;
}
