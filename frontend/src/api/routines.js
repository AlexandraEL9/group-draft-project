// frontend/src/api/routines.js
import { api } from "./client";

// GET /routines?user_id=123 → { routines: [...] }
export async function getRoutines(user_id) {
  const res = await api.get("/routines", { params: { user_id } });
  return res.data; // { routines: [...] }
}

