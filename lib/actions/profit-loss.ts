"use server"

import { type ActionResult, runAction } from "@/lib/api"
import {
  getProfitLossTransactions,
  type ProfitLossTransactions,
  type ProfitLossTransactionsQuery,
} from "@/lib/profit-loss"

export async function fetchProfitLossTransactions(
  orgId: number,
  query: ProfitLossTransactionsQuery
): Promise<ActionResult<ProfitLossTransactions>> {
  return runAction(() => getProfitLossTransactions(orgId, query))
}
