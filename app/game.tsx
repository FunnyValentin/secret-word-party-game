import {StyleSheet, View, Text} from "react-native";
import {useTheme} from "@/components/ThemeProvider";
import {useEffect, useState} from "react";
import socketService, {GameState, Room} from "@/services/SocketService";
import Button from "@/components/Button";

export default function GameScreen( ) {
    const [room, setRoom] = useState<Room>()
    const [isHost, setIsHost] = useState<boolean>(false)
    const [gameState, setGameState] = useState<GameState>()
    const {colors} = useTheme();

    useEffect(() => {
        console.log(socketService.getJoinedRoom())
        socketService.getRoomInfo(socketService.getJoinedRoom())
        socketService.onRoomInfo((room) => {
            setRoom(room);
            const socketId = socketService.getSocket()?.id;
            const currentPlayer = room.players.find((player) => player.id === socketId);
            setIsHost(currentPlayer?.isHost || false);
            setGameState(room.gameState);
        })
        socketService.onGameStateUpdate(setGameState)
    }, []);

    const handleChooseCategory = () => {
        socketService.setChoosingCategory(socketService.getJoinedRoom())
    }

    if(!room) {
        return(
            <View style={[styles.container, {backgroundColor: colors.BACKGROUND}]}>
                <Text style={[styles.text, {color: colors.TEXT}]}>NO SE ENCONTRÓ LA SALA</Text>
            </View>
        )
    }

    return(
        <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
            <Text style={[styles.title, { color: colors.TEXT }]}>{room?.roomName}</Text>
            {gameState!.state === "WAITING" &&
                (isHost ? (
                    <Button
                        label="Iniciar partida"
                        onPress={handleChooseCategory}
                    />
                ) : (
                    <Text style={[styles.text, { color: colors.TEXT }]}>Esperando que el anfitrión inicie partida</Text>
                ))}
            {gameState!.state === "CHOOSING_CATEGORY" &&
                (isHost ? (
                    <Text style={[styles.text, { color: colors.TEXT }]}>Elegir categoria</Text>
                ) : (
                    <Text style={[styles.text, { color: colors.TEXT }]}>Esperando que el anfitrión elija una categoría</Text>
                ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 36,
    },
    text: {
        fontSize: 18,
    }
})
