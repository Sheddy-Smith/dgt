"use client"

// Simple client-side auth helper using JSON Server
// Storage keys
const SESSION_KEY = "dgt_session"
const AUTH_EVENT = "dgt:auth-change"

export interface AuthUser {
  id: string
  name: string
  phone?: string
  mobile?: string
  tokens: number
  email?: string
}

function getBaseUrl() {
  return "http://localhost:3001"
}

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function onAuthChange(cb: () => void) {
  const handler = () => cb()
  window.addEventListener(AUTH_EVENT, handler)
  // Also listen to storage events to sync across tabs
  const storageHandler = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) cb()
  }
  window.addEventListener("storage", storageHandler)
  return () => {
    window.removeEventListener(AUTH_EVENT, handler)
    window.removeEventListener("storage", storageHandler)
  }
}

export function getSession(): { userId: string } | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(userId: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }))
  emitAuthChange()
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  emitAuthChange()
}

export async function fetchUserById(id: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/users/${id}`)
    if (!res.ok) return null
    const data = await res.json()
    return {
      id: data.id,
      name: data.name || "",
      phone: data.phone,
      mobile: data.mobile,
      tokens: data.tokens ?? 0,
      email: data.email,
    }
  } catch (e) {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = getSession()
  if (!session) return null
  return await fetchUserById(session.userId)
}

export async function isLoggedIn(): Promise<boolean> {
  const session = getSession()
  if (!session) return false
  try {
    const res = await fetch(`${getBaseUrl()}/users/${session.userId}`)
    if (!res.ok) return false
    const data = await res.json()
    return !!data.isLoggedIn
  } catch {
    return false
  }
}

export async function login(phoneOrMobile: string, password: string): Promise<{ ok: boolean; message?: string; user?: AuthUser }> {
  try {
    const q = encodeURIComponent(phoneOrMobile)
    // Search by phone OR mobile
    const res = await fetch(`${getBaseUrl()}/users?phone=${q}`)
    let list: any[] = []
    if (res.ok) list = await res.json()
    if (!list.length) {
      const res2 = await fetch(`${getBaseUrl()}/users?mobile=${q}`)
      if (res2.ok) list = await res2.json()
    }
    if (!list.length) {
      return { ok: false, message: "Invalid login details" }
    }
    const user = list[0]
    if (String(user.password) !== String(password)) {
      return { ok: false, message: "Invalid login details" }
    }
    // Mark logged in
    await fetch(`${getBaseUrl()}/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLoggedIn: true })
    })
    setSession(user.id)
    return { ok: true, user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      mobile: user.mobile,
      tokens: user.tokens ?? 0,
      email: user.email,
    }}
  } catch (e) {
    return { ok: false, message: "Network error" }
  }
}

export async function logout(): Promise<void> {
  const session = getSession()
  if (session) {
    try {
      await fetch(`${getBaseUrl()}/users/${session.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLoggedIn: false })
      })
    } catch {}
  }
  clearSession()
}

export function requireAuth(redirect: (path: string) => void) {
  // Client-side guard: if not logged in, redirect immediately
  isLoggedIn().then((ok) => {
    if (!ok) redirect('/login')
  })
}
