import Link from "next/link"

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
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/users"

import { DeleteUserButton } from "./delete-user-button"

export function UsersTable({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          People across all organizations and which ones they can access.
        </CardDescription>
        <CardAction>
          <Link href="/users/new" className={cn(buttonVariants())}>
            Add User
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
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
                <TableCell className="text-muted-foreground capitalize">
                  {user.status}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/users/${user.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Edit
                    </Link>
                    <DeleteUserButton
                      userId={user.id}
                      userName={user.fullName}
                      disabled={user.id === currentUserId}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
