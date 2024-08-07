import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id: string]: Socket
}

@Injectable()
export class MessageWsService {
    private clients: ConnectedClients = {};

    addClient(client: Socket) {
        this.clients[client.id] = client;
        this.foundClientsAll();
    }
    removeClient(client: Socket) {
        delete this.clients[client.id];
        this.foundClientsAll();
    }

    foundClientsAll(): string[] {
        const clientsId: string[] = Object.keys(this.clients);
        console.log(clientsId)
        return clientsId;
    }

}
