import { auth } from "../firebase";

export const BASE_API_URL = "https://api.technika.co";

export async function getAuthHeaders({ json = true } = {}) {
  const user = auth.currentUser;
  if (!user) {
    const h = {};
    if (json) h["Content-Type"] = "application/json";
    return h;
  }

  const token = await user.getIdToken();
  const headers = { Authorization: `Bearer ${token}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

export async function fetchJson(url, options = {}) {
  const resp = await fetch(url, options);
  const text = await resp.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }
  return { resp, data };
}
