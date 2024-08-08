import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { MessageClientDto } from './dtos/message-client.dto';


@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private readonly wss: Server;
  constructor(private readonly messageWsService: MessageWsService) { }

  async handleConnection(client: Socket) {
    await this.messageWsService.addClient(client);
    this.updatedClients();
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client);
    this.updatedClients();
  }

  updatedClients() {
    const clientsId = this.messageWsService.foundClientsAll();
    this.wss.emit('updated-clients', clientsId);
  }

  @SubscribeMessage('message-from-client')
  addMessage(client: Socket, data: MessageClientDto) {
    const user = this.messageWsService.getUser(client.id);
    const result = {
      fullname: user.fullname,
      message: data
    }

    //!Emite el mensage a este cliente
    // client.emit('message-from-client', result)
    //!Emite el mensage a todos los otros clientes
    // client.broadcast.emit('message-from-client', result)

    //!Emite el mensage a todos los otros clientes
    this.wss.emit('message-from-client', result)

  }

}
