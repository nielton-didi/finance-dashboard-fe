import { cookies } from "next/headers"

export async function getSidebarDefaultOpen() {
  const cookieStore = await cookies()
  const value = cookieStore.get("sidebar_state")?.value

  return value === undefined ? true : value === "true"
}
