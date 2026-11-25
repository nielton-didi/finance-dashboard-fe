"use server"

import { type ActionResult, runAction } from "@/lib/api"
import {
  getProfitLossTransactions,
  type ProfitLossTransactionsQuery,
} from "@/lib/profit-loss"
import type { StatementTransactions } from "@/lib/statement"

export async function fetchProfitLossTransactions(
  orgId: number,
  query: ProfitLossTransactionsQuery
): Promise<ActionResult<StatementTransactions>> {
  return runAction(() => getProfitLossTransactions(orgId, query))
}
