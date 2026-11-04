import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleCmsRequest } from '../server/handler.js';

// Vercel serverless entry. vercel.json routes /api/cms/* here.
export default function handler(req: IncomingMessage, res: ServerResponse) {
  return handleCmsRequest(req, res);
}
