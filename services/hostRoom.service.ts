import { WebSocketServer, WebSocket } from "ws";

type CreateRoomProps = {
    roomName: string;
    isPasswordProtected: boolean;
    password?: string;
    hostName: string;
    hostAvatar: string;
};

type Player = {
    name: string;
    avatar: string;
    score: number;
    socket: WebSocket;
};

export function createRoom({
                               roomName,
                               isPasswordProtected,
                               password,
                               hostName,
                               hostAvatar,
                           }: CreateRoomProps) {
    const wss = new WebSocketServer({ port: 8080 });
    const players: Player[] = [];

    const host: Player = {
        name: hostName,
        avatar: hostAvatar,
        score: 0,
        socket: null as any,
    };
    players.push(host);

    const room = {
        roomName,
        isPasswordProtected,
        password: isPasswordProtected ? password : null,
        players,

        broadcast(message: any) {
            players.forEach((player) => {
                if (player.socket?.readyState === WebSocket.OPEN) {
                    player.socket.send(JSON.stringify(message));
                }
            });
        },

        addPlayer(player: Player) {
            players.push(player);
            this.broadcast({ type: "PLAYER_JOINED", player });
        },

        removePlayer(socket: WebSocket) {
            const index = players.findIndex((p) => p.socket === socket);
            if (index !== -1) {
                const [removedPlayer] = players.splice(index, 1);
                this.broadcast({ type: "PLAYER_LEFT", player: removedPlayer });
            }
        },
    };

    wss.on("connection", (socket) => {
        console.log("Player connected");

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === "JOIN") {
                const { name, avatar } = message;
                const newPlayer: Player = { name, avatar, score: 0, socket };
                room.addPlayer(newPlayer);
            } else if (message.type === "ACTION") {
                // Handle player actions (e.g., voting, choosing a word, etc.)
                console.log(`Received action from player: ${message.action}`);
                room.broadcast({ type: "ACTION", data: message });
            }
        });

        socket.on("close", () => {
            console.log("Player disconnected");
            room.removePlayer(socket);
        });
    });

    return room;
}
