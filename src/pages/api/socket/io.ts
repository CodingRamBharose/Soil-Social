import { NextApiRequest } from 'next';
import { NextApiResponseWithSocket } from '@/lib/socket';
import { initSocket } from '@/lib/socket';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  initSocket(res);
  res.end();
}
