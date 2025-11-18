import { EventEmitter } from 'node:events'
import { registerPartnerShare, markWorkDelivered, activateCapitalShare } from '../v4/partnerShares'
import { startDistributionOwner } from '../v4/vault'
import { recordDividendClaim } from '../v4/dividends'

export type JobName =
  | 'registerPartnerShare'
  | 'markWorkDelivered'
  | 'activateCapitalShare'
  | 'recordDividendClaim'
  | 'startDistribution'

export interface V4Job<TPayload = any> {
  name: JobName
  payload: TPayload
  id: string
  attempts: number
}

type JobHandler = (job: V4Job) => Promise<void>

class InMemoryQueue extends EventEmitter {
  private processing = false
  private queue: V4Job[] = []
  private handlers: Map<JobName, JobHandler> = new Map()

  registerHandler(name: JobName, handler: JobHandler) {
    this.handlers.set(name, handler)
  }

  async enqueue<T = any>(name: JobName, payload: T) {
    const job: V4Job = {
      name,
      payload,
      id: `${name}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      attempts: 0,
    }
    this.queue.push(job)
    this.emit('queued', job)
    void this.process()
    return job.id
  }

  private async process() {
    if (this.processing) return
    this.processing = true
    while (this.queue.length) {
      const job = this.queue.shift()!
      const handler = this.handlers.get(job.name)
      if (!handler) {
        console.warn(`[v4 queue] No handler for ${job.name}, dropping job`)
        continue
      }
      try {
        job.attempts += 1
        await handler(job)
        this.emit('completed', job)
      } catch (error) {
        nap(this.queue, job, error)
      }
    }
    this.processing = false
  }
}

function nap(queue: V4Job[], job: V4Job, error: unknown) {
  console.error(`[v4 queue] Job ${job.name} failed:`, error)
  if (job.attempts < 3) {
    queue.push(job)
  }
}

export const v4Queue = new InMemoryQueue()

export async function enqueueV4Job<T = any>(name: JobName, payload: T) {
  await ensureHandlersRegistered()
  return v4Queue.enqueue(name, payload)
}

let handlersRegistered = false
async function ensureHandlersRegistered() {
  if (handlersRegistered) return
  v4Queue.registerHandler('registerPartnerShare', async (job) => {
    const payload = job.payload as {
      projectId: string
      proposalId?: string
      walletAddress: string
      shareBps: number
      status?: string
    }
    await registerPartnerShare({
      projectId: payload.projectId,
      proposalId: payload.proposalId,
      walletAddress: payload.walletAddress,
      shareBps: payload.shareBps,
      status: (payload.status as any) ?? 'pending'
    })
  })
  v4Queue.registerHandler('markWorkDelivered', async (job) => {
    const payload = job.payload as { shareId: string }
    await markWorkDelivered(payload.shareId)
  })
  v4Queue.registerHandler('activateCapitalShare', async (job) => {
    const payload = job.payload as { shareId: string; capitalEventId?: string }
    if (payload.shareId) {
      await activateCapitalShare(payload.shareId)
    } else {
      console.log('[v4 queue] activateCapitalShare pending share assignment', payload.capitalEventId)
    }
  })
  v4Queue.registerHandler('recordDividendClaim', async (job) => {
    const payload = job.payload as {
      projectId: string
      partnerShareId: string
      vaultPeriod: string
      amount?: string
      txHash?: string
    }
    await recordDividendClaim({
      projectId: payload.projectId,
      partnerShareId: payload.partnerShareId,
      vaultPeriod: payload.vaultPeriod,
      amount: payload.amount,
      txHash: payload.txHash,
    })
  })
  v4Queue.registerHandler('startDistribution', async (job) => {
    const payload = job.payload as { projectId: string; period: string }
    if (!payload.projectId || !payload.period) {
      throw new Error('Missing projectId/period')
    }
    try {
      await startDistributionOwner(payload.projectId, payload.period)
    } catch (error: any) {
      // Idempotent: If period already started, treat as success
      const errorMsg = error?.message || error?.reason || String(error)
      if (errorMsg.includes('Already started') || errorMsg.includes('already started')) {
        console.log(`[v4 queue] Distribution period ${payload.period} already started for project ${payload.projectId}, skipping`)
        return
      }
      throw error
    }
  })
  handlersRegistered = true
}

