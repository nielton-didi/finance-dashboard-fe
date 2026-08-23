"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ActionResult } from "@/lib/api"

export function ConfirmDeleteDialog({
  trigger,
  title,
  description,
  confirmValue,
  confirmValueLabel,
  confirmButtonLabel = "Delete",
  onConfirm,
}: {
  trigger: React.ReactElement
  title: string
  description: React.ReactNode
  /** If set, the delete button stays disabled until this exact text is typed. */
  confirmValue?: string
  confirmValueLabel?: string
  confirmButtonLabel?: string
  onConfirm: () => Promise<ActionResult<unknown>>
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typedValue, setTypedValue] = useState("")

  const canConfirm = !confirmValue || typedValue === confirmValue

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setTypedValue("")
      setError(null)
    }
  }

  async function handleConfirm() {
    setError(null)
    setIsDeleting(true)
    try {
      const result = await onConfirm()
      if (!result.ok) {
        setError(result.message ?? "Something went wrong")
        return
      }
      setOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {confirmValue && (
          <Field>
            <FieldLabel htmlFor="confirm-delete-value">
              {confirmValueLabel ?? `Type "${confirmValue}" to confirm`}
            </FieldLabel>
            <Input
              id="confirm-delete-value"
              value={typedValue}
              onChange={(event) => setTypedValue(event.target.value)}
              autoComplete="off"
            />
          </Field>
        )}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={!canConfirm || isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? "Deleting..." : confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
