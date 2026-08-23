import { format } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api"
import { getUsers } from "@/lib/users"

interface AuditLogEntry {
  id: number
  organizationId: number | null
  userId: number | null
  action: string
  details: string | null
  createdAt: string
}

function formatDetails(details: string | null): string {
  if (!details) return "—"
  try {
    const parsed = JSON.parse(details)
    return Object.entries(parsed)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
  } catch {
    return details
  }
}

export default async function AuditLogPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params

  const [auditEvents, users] = await Promise.all([
    apiFetch<AuditLogEntry[]>(`/organizations/${orgId}/audit-log`),
    getUsers(),
  ])

  const userNameById = new Map(users.map((u) => [u.id, u.fullName]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>
          A record of changes and account activity for this organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="text-muted-foreground">
                  {format(new Date(event.createdAt), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell>
                  {event.userId
                    ? (userNameById.get(event.userId) ?? `User #${event.userId}`)
                    : "System"}
                </TableCell>
                <TableCell>{event.action}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDetails(event.details)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
