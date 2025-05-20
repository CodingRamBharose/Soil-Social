import { NextApiRequest, NextApiResponse } from 'next';
import { initSocket } from '@/lib/socket';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: any;
    };
  }
) {
  initSocket(res);
  res.end();
} 