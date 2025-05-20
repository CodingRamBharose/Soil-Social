import { NextApiRequest } from 'next';
import { initSocket, NextApiResponseWithSocket } from '@/lib/socket';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  initSocket(res);
  res.end();
}