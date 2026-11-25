"use server"

import { type ActionResult, runAction } from "@/lib/api"
import {
  getCashFlowTransactions,
  type CashFlowTransactionsQuery,
} from "@/lib/cash-flow"
import type { StatementTransactions } from "@/lib/statement"

export async function fetchCashFlowTransactions(
  orgId: number,
  query: CashFlowTransactionsQuery
): Promise<ActionResult<StatementTransactions>> {
  return runAction(() => getCashFlowTransactions(orgId, query))
}
