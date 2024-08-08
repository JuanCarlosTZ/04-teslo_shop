import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessageWsService {
    private clients: ConnectedClients = {};

    constructor(
        private readonly authService: AuthService
    ) { }

    async addClient(client: Socket) {
        const accessToken = client.handshake.headers.authorization;
        try {
            const payload = this.authService.checkAccessToken(accessToken);
            const user = await this.authService.checkJwtPayload(payload);
            this.clients[client.id] = { socket: client, user: user };
            this.clearConexions(client.id);
        } catch (err) {
            client.emit('execption', 'Unauthorize access');
            client.disconnect();
        }
    }

    removeClient(client: Socket) {
        delete this.clients[client.id];
    }

    foundClientsAll(): string[] {
        const clientsId: string[] = Object.keys(this.clients);
        console.log(clientsId)
        return clientsId;
    }

    getUser(clientId: string): User {
        return this.clients[clientId].user;
    }

    clearConexions(clientId: string) {
        const userEmail = this.clients[clientId]?.user.email;
        Object.keys(this.clients).forEach(clientIdItem => {
            const email = this.clients[clientIdItem].user.email;
            if (userEmail === email && clientId !== clientIdItem) {
                this.clients[clientIdItem].socket.disconnect();
                return;
            }
        })
    }

}
