export function saveAuth(data: { token: string; role: string }) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function logout() {
  localStorage.clear();
}