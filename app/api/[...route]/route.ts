import { app } from "@/server"
import { NextRequest } from "next/server"

const handler = (req: NextRequest) => {
  return app.fetch(req)
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
}
