// frontend/src/api/routines.js
import { api } from "./client";

// GET /routines?user_id=123 → { routines: [...] }
export async function getRoutines(user_id) {
  const res = await api.get("/routines", { params: { user_id } });
  return res.data; // { routines: [...] }
}

// GET /routine-player?routine_id=123  → { routine, tasks: [...] }
export async function getRoutinePlayer(routine_id) {
  const res = await api.get("/routine-player", { params: { routine_id } });
  return res.data; // { routine, tasks }
}

