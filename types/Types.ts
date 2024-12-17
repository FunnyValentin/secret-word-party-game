import {WebSocket} from "ws";

export type Room = {
    roomName: string;
    isPasswordProtected: boolean;
    password: string;
    players: Player[];
    maxPlayers: number;
    broadcast: (message: any) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (socket: WebSocket) => void;
}

export type Player = {
    name: string;
    avatar: string;
    score: number;
    socket: WebSocket;
};
