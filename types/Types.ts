import TcpSocket from 'react-native-tcp-socket';
import {Player} from "@/services/SocketService";

export type Room = {
    roomName: string;
    isPasswordProtected: boolean;
    password: string | null | undefined;
    players: Player[];
    maxPlayers: number;
    broadcast: (message: any) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (socket: TcpSocket.Socket) => void;
};
