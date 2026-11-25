import { BarList } from "@/components/statement/bar-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { GroupCompany } from "@/lib/group"

/** One measure by company, largest first. */
export function CompanyRankingCard<T>({
  title,
  description,
  companies,
  value,
}: {
  title: string
  description: string
  companies: GroupCompany<T>[]
  value: (metrics: T) => number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <BarList
          items={companies
            .map(({ organizationId, name, current }) => ({
              key: String(organizationId),
              label: name,
              value: value(current),
            }))
            .sort((a, b) => b.value - a.value)}
        />
      </CardContent>
    </Card>
  )
}
