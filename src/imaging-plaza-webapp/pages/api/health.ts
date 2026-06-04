import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchTimeout } from '@/utils/fetch/timeouts'

const HEALTH_PROBE_TIMEOUT_MS = 3_000

type ProbeResult =
  | { status: 'ok'; latency_ms: number }
  | { status: 'error'; error: string }

const probe = async (url: string | undefined): Promise<ProbeResult> => {
  if (!url) {
    return { status: 'error', error: 'url not configured' }
  }
  const start = Date.now()
  try {
    await fetch(url, {
      method: 'HEAD',
      signal: fetchTimeout(HEALTH_PROBE_TIMEOUT_MS),
    })
    return { status: 'ok', latency_ms: Date.now() - start }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'unknown'
    return { status: 'error', error }
  }
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const [graphdb, fair_indicator, inference, search, gimie] = await Promise.all([
    probe(process.env.IP_DB_URL),
    probe(process.env.IP_FAIR_LEVEL_INDICATOR),
    probe(process.env.IP_INFERENCE_URL),
    probe(process.env.IP_SEARCH_URL),
    probe(process.env.IP_GIMIE_URL),
  ])

  const dependencies = { graphdb, fair_indicator, inference, search, gimie }
  const allOk = Object.values(dependencies).every(d => d.status === 'ok')

  res.status(200).json({
    status: 'ok',
    dependencies_ok: allOk,
    dependencies,
  })
}
