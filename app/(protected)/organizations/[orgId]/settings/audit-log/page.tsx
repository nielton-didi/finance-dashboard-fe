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

// TODO: replace with audit events fetched from the backend once it's available
const auditEvents = [
  {
    timestamp: "2026-08-20 09:12",
    user: "Jane Doe",
    action: "Signed in",
    details: "—",
  },
  {
    timestamp: "2026-08-19 17:45",
    user: "Jane Doe",
    action: "Updated AutoCount Database connection",
    details: "Host changed",
  },
  {
    timestamp: "2026-08-19 14:03",
    user: "John Tan",
    action: "Updated organization profile",
    details: "Registration number added",
  },
  {
    timestamp: "2026-08-18 11:20",
    user: "John Tan",
    action: "Changed password",
    details: "—",
  },
]

export default function AuditLogPage() {
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
            {auditEvents.map((event, index) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground">
                  {event.timestamp}
                </TableCell>
                <TableCell>{event.user}</TableCell>
                <TableCell>{event.action}</TableCell>
                <TableCell className="text-muted-foreground">
                  {event.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
