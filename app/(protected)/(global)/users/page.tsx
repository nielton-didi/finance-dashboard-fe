import { UserPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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
import { organizations } from "@/config/organizations"

// TODO: replace with users fetched from the backend once it's available
const users = [
  {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    status: "Active",
    access: [
      { orgId: "acme-inc", role: "Owner" },
      { orgId: "acme-corp", role: "Admin" },
    ],
  },
  {
    name: "John Tan",
    email: "john.tan@example.com",
    status: "Active",
    access: [{ orgId: "acme-inc", role: "Admin" }],
  },
  {
    name: "Sarah Lim",
    email: "sarah.lim@example.com",
    status: "Invited",
    access: [{ orgId: "evil-corp", role: "Viewer" }],
  },
]

function orgName(orgId: string) {
  return organizations.find((org) => org.id === orgId)?.name ?? orgId
}

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          People across all organizations and which ones they can access.
        </CardDescription>
        <CardAction>
          <Button>
            <UserPlusIcon />
            Invite User
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organization Access</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.access.map((grant) => (
                      <span
                        key={grant.orgId}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                      >
                        {orgName(grant.orgId)}
                        <span className="text-muted-foreground">
                          &middot; {grant.role}
                        </span>
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
