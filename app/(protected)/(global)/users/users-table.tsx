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
import type { Organization } from "@/lib/organizations"
import type { User } from "@/lib/users"

import { AccessControls } from "./access-controls"
import { AddUserSheet } from "./add-user-sheet"

export function UsersTable({
  users,
  organizations,
}: {
  users: User[]
  organizations: Organization[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          People across all organizations and which ones they can access.
        </CardDescription>
        <CardAction>
          <AddUserSheet />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Organization Access</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>
                  {user.role === "admin" ? (
                    <span className="text-xs text-muted-foreground">
                      All organizations
                    </span>
                  ) : (
                    <AccessControls
                      userId={user.id}
                      organizations={organizations}
                    />
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">
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
