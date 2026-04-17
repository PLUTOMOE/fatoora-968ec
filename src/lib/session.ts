import { cookies } from "next/headers";

const SESSION_COOKIE = "fatora_session";

export async function setSession(userId: number) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(SESSION_COOKIE)?.value;
  const userId = Number(rawValue);

  return Number.isFinite(userId) ? userId : null;
}
