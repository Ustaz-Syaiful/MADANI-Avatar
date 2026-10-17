export default function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return res.status(200).json({
    status: 'ok',
    hasKey,
    event: 'Karnival MADANI PPD Kulim Bandar Baharu',
    app: 'MADANI AI Avatar Studio',
    platform: 'vercel-serverless',
    timestamp: new Date().toISOString()
  });
}
