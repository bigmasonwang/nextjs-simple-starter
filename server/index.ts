import { Hono } from "hono"
import { auth } from "@/lib/auth"

// Create API app with base path
export const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}>().basePath("/api")

// Global middleware to add session and user to context
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    c.set("user", null)
    c.set("session", null)
    return next()
  }

  c.set("user", session.user)
  c.set("session", session.session)
  return next()
})

// Mount Better Auth handler
app.on(["POST", "GET"], "/auth/*", c => {
  return auth.handler(c.req.raw)
})

// Example protected route
app.get("/session", c => {
  const session = c.get("session")
  const user = c.get("user")

  if (!user) return c.body(null, 401)

  return c.json({
    session,
    user,
  })
})

// Health check endpoint
app.get("/health", c => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() })
})

export default app
