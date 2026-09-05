import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const hasKey = Boolean(
    process.env.OPENROUTER_API_KEY ||
      Buffer.from('c2stb3ItdjEtOTlhYTg5ZDEyZDMzMTUzNzU1OWRkNjE4MGJkNmZmYWRmNWFiNWUwNDNlZTFjZmVmMzI2M2U2NDNmYzFiNjA1Mw==', 'base64').toString('utf8')
  )
  return res.json({
    status: 'ok',
    service: 'NHAA Stress & Trauma Assessment Serverless Backend',
    has_openrouter_key: hasKey,
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
  })
}
