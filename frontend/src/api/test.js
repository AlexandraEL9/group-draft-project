import { api } from "./client";

export async function apiTest() {
  const res = await api.get("/api/test");
  return res.data; // { message: "Hello from the backend API!" }
}