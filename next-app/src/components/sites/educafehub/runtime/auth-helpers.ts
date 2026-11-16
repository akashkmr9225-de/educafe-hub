export interface Profile {
  name: string;
  contact: string;
  kind: "school" | "cafe";
}

export interface AuthState {
  profile: Profile | null;
}

const PK = "educafehub_profile";

let listeners: ((state: AuthState) => void)[] = [];

export function getAuthState(): AuthState {
  try {
    const v = localStorage.getItem(PK);
    if (v) {
      const p = JSON.parse(v) as Profile;
      return { profile: p };
    }
  } catch {}
  return { profile: null };
}

export function setAuthState(profile: Profile): void {
  try {
    localStorage.setItem(PK, JSON.stringify(profile));
  } catch {}
  listeners.forEach((l) => l({ profile }));
}

export function clearAuthState(): void {
  try {
    localStorage.removeItem(PK);
  } catch {}
  listeners.forEach((l) => l({ profile: null }));
}

export function getAuthProfile(): Profile | null {
  return getAuthState().profile;
}

export function watchAuthState(fn: (state: AuthState) => void): () => void {
  listeners.push(fn);
  fn(getAuthState());
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}