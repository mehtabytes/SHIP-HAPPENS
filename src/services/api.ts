const API_BASE_URL = "http://localhost:5000";

export async function getFiles() {
  const response = await fetch(`${API_BASE_URL}/api/files`);
  if (!response.ok) throw new Error("Failed to fetch files");
  return response.json();
}

export async function getChanges() {
  const response = await fetch(`${API_BASE_URL}/api/changes`);
  if (!response.ok) throw new Error("Failed to fetch changes");
  return response.json();
}

export async function getTrust() {
  const response = await fetch(`${API_BASE_URL}/api/trust`);
  if (!response.ok) throw new Error("Failed to fetch trust summary");
  return response.json();
}

export async function runVerification() {
  const response = await fetch(`${API_BASE_URL}/api/verify`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Verification failed");
  return response.json();
}