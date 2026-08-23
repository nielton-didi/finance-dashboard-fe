"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  testAutocountConnection,
  updateAutocountSettings,
} from "@/lib/actions/autocount-settings"
import type { MaskedAutocountCredential } from "@/lib/autocount-settings"

export function DatabaseForm({
  orgId,
  settings,
}: {
  orgId: number
  settings: MaskedAutocountCredential | null
}) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const [testState, setTestState] = useState<
    { status: "idle" } | { status: "testing" } | { status: "ok" } | { status: "error"; message: string }
  >({ status: "idle" })

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      const result = await updateAutocountSettings(orgId, {
        host: String(formData.get("host") ?? ""),
        port: Number(formData.get("port")),
        databaseName: String(formData.get("database") ?? ""),
        username: String(formData.get("username") ?? ""),
        password: String(formData.get("password") ?? ""),
      })

      if (!result.ok) {
        setError(result.message ?? "Failed to save database settings")
        return
      }

      setSaved(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleTestConnection() {
    setTestState({ status: "testing" })
    const result = await testAutocountConnection(orgId)
    if (result.ok) {
      setTestState({ status: "ok" })
    } else {
      setTestState({
        status: "error",
        message: result.message ?? "Connection failed",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AutoCount Database</CardTitle>
        <CardDescription>
          Connection details for this organization&apos;s AutoCount
          database. Report data such as the dashboard and the Profit &amp;
          Loss statement is fetched directly from here.
        </CardDescription>
      </CardHeader>
      <form className="contents" onSubmit={handleSave}>
        <CardContent>
          <FieldGroup>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel htmlFor="host">Host</FieldLabel>
              <Input
                id="host"
                name="host"
                defaultValue={settings?.host}
                placeholder="192.168.1.10"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="port">Port</FieldLabel>
              <Input
                id="port"
                name="port"
                type="number"
                defaultValue={settings?.port}
                placeholder="1433"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="database">Database Name</FieldLabel>
              <Input
                id="database"
                name="database"
                defaultValue={settings?.databaseName}
                placeholder="ACSQL2008_CompanyName"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                defaultValue={settings?.username}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" name="password" type="password" required />
              <p className="text-xs text-muted-foreground">
                {settings?.hasPassword
                  ? "A password is already saved. Enter it again to change it — the backend never returns it for display."
                  : "Enter the AutoCount database password."}
              </p>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-1 items-center gap-2 text-sm">
            {testState.status === "ok" && (
              <span className="text-emerald-600 dark:text-emerald-400">
                Connection successful
              </span>
            )}
            {testState.status === "error" && (
              <span className="text-destructive">{testState.message}</span>
            )}
            {saved && (
              <span className="text-muted-foreground">Saved</span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={testState.status === "testing"}
            onClick={handleTestConnection}
          >
            {testState.status === "testing" ? "Testing..." : "Test Connection"}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
