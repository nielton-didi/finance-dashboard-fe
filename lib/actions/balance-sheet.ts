"use server"

import { type ActionResult, runAction } from "@/lib/api"
import {
  getBalanceSheetTransactions,
  type BalanceSheetTransactionsQuery,
} from "@/lib/balance-sheet"
import type { StatementTransactions } from "@/lib/statement"

export async function fetchBalanceSheetTransactions(
  orgId: number,
  query: BalanceSheetTransactionsQuery
): Promise<ActionResult<StatementTransactions>> {
  return runAction(() => getBalanceSheetTransactions(orgId, query))
}
