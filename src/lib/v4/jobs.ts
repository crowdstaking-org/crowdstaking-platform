import { enqueueV4Job } from '../queues/v4Queue'

export type JobName =
  | 'registerPartnerShare'
  | 'markWorkDelivered'
  | 'activateCapitalShare'
  | 'startDistribution'

export async function dispatchJob(
  name: JobName,
  payload: Record<string, unknown>
) {
  const jobId = await enqueueV4Job(name, payload)
  return { status: 'queued', job: name, id: jobId }
}

