import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";
import socketService, { GameState, Room } from "@/services/SocketService";
import Button from "@/components/Button";
import PlayerList from "@/components/game-screen-components/PlayerList";
import React from "react";

export default function GameScreen() {
    const [room, setRoom] = useState<Room>();
    const [isHost, setIsHost] = useState<boolean>(false);
    const [gameState, setGameState] = useState<GameState>();
    const { colors } = useTheme();

    useEffect(() => {
        console.log("Getting room info for room:", socketService.getJoinedRoom());
        socketService.getRoomInfo(socketService.getJoinedRoom());

        const handleRoomInfo = (updatedRoom: Room) => {
            console.log("actualizacion recibida", updatedRoom.players);
            setRoom({ ...updatedRoom });
            setIsHost(socketService.getSocket()?.id === updatedRoom.players.find(p => p.isHost)?.id);
            setGameState({ ...updatedRoom.gameState });
        };

        console.log("Setting up roomInfo listener");
        socketService.onRoomInfo(handleRoomInfo);

        return () => {
            console.log("Cleaning up roomInfo listener");
            socketService.offRoomInfo(handleRoomInfo);
        };
    }, [])

    const handleChooseCategory = () => {
        socketService.setChoosingCategory(socketService.getJoinedRoom());
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND,
            padding: 16,
        },
        title: {
            fontSize: 28,
            color: colors.TEXT,
            alignSelf: "center",
            marginBottom: 16,
            fontWeight: "bold",
        },
        text: {
            fontSize: 16,
            color: colors.TEXT,
            textAlign: "center",
            marginVertical: 8,
        },
        section: {
            marginVertical: 16,
        },
        buttonContainer: {
            marginTop: 20,
            alignItems: "center",
        },
        waitingText: {
            fontSize: 18,
            color: colors.TEXT_SECONDARY,
            textAlign: "center",
            marginTop: 16,
        },
    });

    if (!room) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>NO SE ENCONTRÓ LA SALA</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{room?.roomName} - {socketService.getSocket()?.id}</Text>

            <View style={styles.section}>
                <PlayerList players={room.players} />
            </View>

            {gameState?.state === "WAITING" && (
                <View>
                    {isHost ? (
                        <>
                            <View style={styles.buttonContainer}>
                                <Button
                                    label="Iniciar partida"
                                    onPress={handleChooseCategory}
                                    variant="primary"
                                />
                            </View>
                        </>
                    ) : (
                        <Text style={styles.waitingText}>
                            Esperando que el anfitrión inicie partida
                        </Text>
                    )}
                </View>
            )}

            {gameState?.state === "CHOOSING_CATEGORY" && (
                <View>
                    <Text style={styles.text}>
                        {isHost
                            ? "Por favor, elige una categoría para comenzar."
                            : "Esperando que el anfitrión elija una categoría."}
                    </Text>
                </View>
            )}
        </View>
    );
}
