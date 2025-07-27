import { Server as NetServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket): SocketIOServer => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      },
      path: '/api/socket/io',
      addTrailingSlash: false
    });

    io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;

      if (!userId) {
        console.error('No userId provided in socket connection');
        socket.disconnect();
        return;
      }

      socket.join(userId);
      console.log(`User ${userId} connected to notifications`);

      socket.on('markAsRead', async (notificationId: string) => {
        try {
          socket.to(userId).emit('notificationRead', notificationId);
        } catch (error) {
          console.error('Error handling markAsRead:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected from notifications`);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    res.socket.server.io = io;
  }

  return res.socket.server.io!;
};

export const emitNotification = (
  io: SocketIOServer,
  userId: string,
  notification: Notification
): void => {
  try {
    io.to(userId).emit('notification', notification);
  } catch (error) {
    console.error('Error emitting notification:', error);
  }
};
