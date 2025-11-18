import { enqueueV4Job } from '@/lib/queues/v4Queue'

interface DividendClaimJob {
  projectId: string
  partnerShareId: string
  vaultPeriod: string
  amount?: string
  txHash?: string
}

export async function enqueueDividendClaim(job: DividendClaimJob) {
  return enqueueV4Job('recordDividendClaim', job)
}

