import { api } from "./client";

export async function login(username, password) {
  const res = await api.post("/login", { username, password });
  return res.data; // { message, userId, username }
}
