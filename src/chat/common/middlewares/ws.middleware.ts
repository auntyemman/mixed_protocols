import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Socket } from 'socket.io';
type WsMiddlewareType = {
  (client: Socket, next: (err?: Error) => void);
};
export const WsMiddleware = (): WsMiddlewareType => {
  return (client, next) => {
    try {
      JwtAuthGuard.validateWsToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
