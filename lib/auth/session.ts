import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: "reader" | "writer" | "superadmin";
  avatar?: string | null;
};

const rawSecret = process.env.SESSION_SECRET;
if (!rawSecret) {
  console.error(
    "[session] WARNING: SESSION_SECRET is not set. " +
    "Authentication will not work correctly in production. " +
    "Set SESSION_SECRET in your Vercel environment variables."
  );
}
const SECRET = new TextEncoder().encode(
  rawSecret ?? "fallback-secret-dev-only-change-in-production"
);

const COOKIE_NAME = "lb_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; 

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(data: SessionPayload) {
  const token = await encrypt(data);
  const expires = new Date(Date.now() + SESSION_DURATION);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decrypt(token);
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function refreshSession() {
  const session = await getSession();
  if (!session) return;
  await createSession(session);
}
