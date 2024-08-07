import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private readonly wss: Server;
  constructor(private readonly messageWsService: MessageWsService) { }

  updatedClients() {
    const clientsId = this.messageWsService.foundClientsAll();
    console.log({ emitEvent: clientsId });
    this.wss.emit('updated-clients', clientsId);
  }

  handleConnection(client: Socket) {
    this.messageWsService.addClient(client);
    this.updatedClients();
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client);
    this.updatedClients();
  }


}
