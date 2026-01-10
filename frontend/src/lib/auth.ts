// Simple localStorage-backed auth helper
const STORAGE_KEY = "pms_auth";

type Stored = {
  role: string;
  user: Record<string, any>;
};

export function saveUser(user: Record<string, any>, role: string) {
  try {
    const payload: Stored = { role, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore storage errors
  }
}

export function getUser(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Stored;
  } catch (e) {
    return null;
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export default { saveUser, getUser, clearUser };
