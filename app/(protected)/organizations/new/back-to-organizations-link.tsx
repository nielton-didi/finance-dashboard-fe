import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export function BackToOrganizationsLink() {
  return (
    <Link
      href="/"
      className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon className="size-4" />
      Back to Organizations
    </Link>
  )
}
