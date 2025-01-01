import { io, Socket } from 'socket.io-client';

export type ServerEvents = {
    createRoom: 'createRoom';
    roomCreated: 'roomCreated';
    joinRoom: 'joinRoom';
    joinedRoom: 'joinedRoom';
    getRooms: 'getRooms';
    roomList: 'roomList';
    getRoomInfo: 'getRoomInfo';
    roomInfo: 'RoomInfo';
    playerList: 'playerList';
    playerDisconnect: 'playerDisconnect';
    error: 'error';
};

export const EVENTS: ServerEvents = {
    createRoom: 'createRoom',
    roomCreated: 'roomCreated',
    joinRoom: 'joinRoom',
    joinedRoom: 'joinedRoom',
    getRooms: 'getRooms',
    roomList: 'roomList',
    getRoomInfo: 'getRoomInfo',
    roomInfo: 'RoomInfo',
    playerList: 'playerList',
    playerDisconnect: 'playerDisconnect',
    error: 'error',
};

// Types for data structures
export interface Player {
    id: string;
    name?: string;
    hostName?: string;
    avatar?: string;
    hostAvatar?: string;
    isHost: boolean;
    score: number;
}

export interface GameState {
    round: number;
    word: string | null;
    impostorID: string | null;
    votes: Record<string, string>;
    state: "WAITING" | "CHOOSING_CATEGORY" | "PLAYING" | "END";
}

export interface Room {
    roomName: string;
    players: Player[];
    maxPlayers: number;
    bannedCategories: string[];
    gameState: GameState;
}

export interface RoomListItem {
    code: string;
    roomName: string;
    isPasswordProtected: boolean;
    maxPlayers: number;
    currentPlayers: number;
}

// Event payload types
export interface CreateRoomPayload {
    roomName: string;
    isPasswordProtected: boolean;
    password: string;
    maxPlayers: number;
    hostName: string;
    hostAvatar: string;
}

export interface JoinRoomPayload {
    roomCode: string;
    password: string;
    playerName: string;
    playerAvatar: string;
}

// Socket.IO event interfaces
export interface ServerToClientEvents {
    connect: () => void;
    disconnect: () => void;
    roomCreated: (data: { roomCode: string }) => void;
    joinedRoom: (data: { roomCode: string }) => void;
    roomList: (rooms: RoomListItem[]) => void;
    roomInfo: (room: Room) => void;
    updateGameState: (state: GameState) => void;
    playerList: (players: Player[]) => void;
    error: (message: string) => void;
}

export interface ClientToServerEvents {
    createRoom: (payload: CreateRoomPayload) => void;
    joinRoom: (payload: JoinRoomPayload) => void;
    getRooms: () => void;
    getRoomInfo: (roomCode: string) => void;
    setChoosingCategory: (roomCode: string) => void;
    playerDisconnect: () => void;
}

export type SocketInstance = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
    private socket: SocketInstance | null = null;
    private joinedRoom: string = '';
    private connectionListeners: Set<(isConnected: boolean) => void> = new Set();

    connect() {
        if (this.socket) return;

        if (!process.env.EXPO_PUBLIC_SOCKET_URL) {
            console.error('SOCKET_URL is not defined in environment variables');
            return;
        }

        this.socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            transports: ['websocket']
        }) as SocketInstance;

        this.setupEventListeners();
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected. ID:', this.socket!.id);
            this.notifyConnectionListeners(true);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.notifyConnectionListeners(false);
        });

        this.socket.on('error', (message) => {
            console.error('Socket error:', message);
        });
    }

    setJoinedRoom(roomCode: string) {
        this.joinedRoom = roomCode;
    }

    getJoinedRoom() {
        return this.joinedRoom;
    }

    // Room creation
    createRoom(payload: CreateRoomPayload) {
        this.socket?.emit('createRoom', payload);
    }

    onRoomCreated(callback: (data: { roomCode: string }) => void) {
        this.socket?.on('roomCreated', callback);
    }

    // Room joining
    joinRoom(payload: JoinRoomPayload) {
        this.socket?.emit('joinRoom', payload);
    }

    onJoinedRoom(callback: (data: { roomCode: string }) => void) {
        this.socket?.on('joinedRoom', callback);
    }

    // Room listing
    getRooms() {
        this.socket?.emit('getRooms');
    }

    onRoomList(callback: (rooms: RoomListItem[]) => void) {
        this.socket?.on('roomList', callback);
    }

    // Room info
    getRoomInfo(roomCode: string) {
        this.socket?.emit('getRoomInfo', roomCode);
    }

    onRoomInfo(callback: (room: Room) => void) {
        this.socket?.on('roomInfo', callback);
    }

    setChoosingCategory(roomCode: string) {
        this.socket?.emit('setChoosingCategory', roomCode)
    }

    onGameStateUpdate(callback: (state: GameState) => void) {
        this.socket?.on('updateGameState', callback)
    }

    // Player management
    onPlayerList(callback: (players: Player[]) => void) {
        this.socket?.on('playerList', callback);
    }

    disconnectPlayer() {
        this.socket?.emit('playerDisconnect');
    }

    // Error handling
    onError(callback: (message: string) => void) {
        this.socket?.on('error', callback);
    }

    // Connection management
    addConnectionListener(listener: (isConnected: boolean) => void) {
        this.connectionListeners.add(listener);
        if (this.socket) {
            listener(this.socket.connected);
        }
    }

    removeConnectionListener(listener: (isConnected: boolean) => void) {
        this.connectionListeners.delete(listener);
    }

    private notifyConnectionListeners(isConnected: boolean) {
        this.connectionListeners.forEach(listener => listener(isConnected));
    }

    getSocket() {
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket.removeAllListeners();
            this.socket = null;
        }
        this.connectionListeners.clear();
    }

    removeAllListeners() {
        if (!this.socket) return;

        this.socket.removeAllListeners('roomCreated');
        this.socket.removeAllListeners('joinedRoom');
        this.socket.removeAllListeners('roomList');
        this.socket.removeAllListeners('roomInfo');
        this.socket.removeAllListeners('playerList');
        this.socket.removeAllListeners('error');
    }
}

export const socketService = new SocketService();
export default socketService;
