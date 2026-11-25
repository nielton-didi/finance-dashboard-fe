import type { CashFlowSection, CashFlowStatement } from "@/lib/cash-flow"
import {
  ZERO,
  type Cell,
  type ItemRow,
  type SectionBlock,
  type StatementBlock,
} from "@/lib/statement-rows"

const cell = (amount: number): Cell => ({ ...ZERO, amount })

/** Lines several cash flows up into shared rows, matching lines by id. */
export function buildCashFlowBlocks(
  statements: CashFlowStatement[],
  { netProfitHref }: { netProfitHref: string }
): StatementBlock[] {
  const summary = (
    id: "netChange" | "openingCash" | "closingCash",
    label: string,
    emphasis = false
  ): StatementBlock => ({
    kind: "summary",
    id,
    emphasis,
    row: {
      id,
      label,
      higherIsBetter: true,
      cells: statements.map((s) => cell(s[id])),
    },
  })

  return [
    activity(
      statements.map((s) => s.operating),
      netProfitHref
    ),
    activity(
      statements.map((s) => s.investing),
      netProfitHref
    ),
    activity(
      statements.map((s) => s.financing),
      netProfitHref
    ),
    summary("netChange", "Net change in cash"),
    summary("openingCash", "Opening cash and bank"),
    summary("closingCash", "Closing cash and bank", true),
    closingBalances(statements),
  ]
}

function activity(
  sections: CashFlowSection[],
  netProfitHref: string
): SectionBlock {
  const rows = new Map<string, ItemRow>()
  sections.forEach((section, index) => {
    for (const item of section.items) {
      let row = rows.get(item.id)
      if (!row) {
        row = {
          id: item.id,
          accountCode: item.accountCode,
          label: item.label,
          higherIsBetter: true,
          canDrillDown: item.accountCode !== null,
          href: item.kind === "net_profit" ? netProfitHref : undefined,
          cells: sections.map(() => ZERO),
        }
        rows.set(item.id, row)
      }
      row.cells[index] = cell(item.amount)
    }
  })

  const { key, title, totalLabel } = sections[0]
  return {
    kind: "section",
    id: key,
    title,
    accType: key,
    items: [...rows.values()],
    canDrillDown: false,
    hideWhenEmpty: false,
    total: {
      id: `${key}-total`,
      label: totalLabel,
      higherIsBetter: true,
      cells: sections.map((section) => cell(section.total)),
    },
  }
}

/** The bank and cash accounts that closing cash is made up of. */
function closingBalances(statements: CashFlowStatement[]): SectionBlock {
  const rows = new Map<string, ItemRow>()
  statements.forEach((statement, index) => {
    for (const { accountCode, accountName, amount } of statement.cashAccounts) {
      let row = rows.get(accountCode)
      if (!row) {
        row = {
          id: `cash:${accountCode}`,
          accountCode,
          label: accountName,
          higherIsBetter: true,
          canDrillDown: false,
          cells: statements.map(() => ZERO),
        }
        rows.set(accountCode, row)
      }
      row.cells[index] = cell(amount)
    }
  })

  return {
    kind: "section",
    id: "cashAccounts",
    title: "CLOSING BALANCE BY ACCOUNT",
    accType: "cash",
    items: [...rows.values()],
    canDrillDown: false,
    hideWhenEmpty: true,
    total: {
      id: "cashAccounts-total",
      label: "Total cash and bank",
      higherIsBetter: true,
      cells: statements.map((s) => cell(s.closingCash)),
    },
  }
}
