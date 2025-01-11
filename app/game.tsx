import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import socketService, { GameState, Room } from "@/services/SocketService";
import Button from "@/components/Button";
import PlayerList from "@/components/game-screen-components/PlayerList";
import CategorySelection from "@/components/game-screen-components/CategorySelection";
import IconButton from "@/components/IconButton";

export default function GameScreen() {
    const [room, setRoom] = useState<Room>();
    const [isHost, setIsHost] = useState<boolean>(false);
    const [gameState, setGameState] = useState<GameState>();
    const [categoryArg, setCategoryArg] = useState<string[]>([]);
    const [categoryInter, setCategoryInter] = useState<string[]>([]);
    const [showWord, setShowWord] = useState(true);
    const [impostorCaught, setImpostorCaught] = useState(false);
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND,
        },
        scrollView: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 24,
        },
        headerContainer: {
            marginBottom: 24,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.TEXT,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
            marginTop: 4,
        },
        playerListContainer: {
            marginBottom: 32,
        },
        centeredContent: {
            alignItems: 'center',
        },
        waitingText: {
            fontSize: 18,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
        },
        infoContainer: {
            backgroundColor: colors.CARD_BACKGROUND,
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
        },
        infoText: {
            fontSize: 16,
            color: colors.TEXT,
            textAlign: 'center',
            paddingBottom: 24,
        },
        wordContainer: {
            backgroundColor: colors.CARD_BACKGROUND,
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            position: 'relative',
        },
        wordText: {
            fontSize: 20,
            fontWeight: '600',
            color: colors.TEXT,
            textAlign: 'center',
        },
        showWordButton: {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: [{ translateY: -12 }],
        },
    });

    useEffect(() => {
        const handleRoomInfo = (updatedRoom: Room) => {
            console.log("Room update received", updatedRoom);
            setRoom({ ...updatedRoom });
            setIsHost(socketService.getSocket()?.id === updatedRoom.players.find(p => p.isHost)?.id);
            setGameState({ ...updatedRoom.gameState });
        };

        console.log("Setting up roomInfo listener");
        socketService.onRoomInfo(handleRoomInfo);

        console.log("Getting room info for room:", socketService.getJoinedRoom());
        socketService.getRoomInfo(socketService.getJoinedRoom());

        socketService.onRoundResult(setImpostorCaught)

        return () => {
            console.log("Cleaning up roomInfo listener");
            socketService.offRoomInfo(handleRoomInfo);
        };
    }, []);

    const handleChooseCategory = () => {
        socketService.setChoosingCategory(socketService.getJoinedRoom());
        socketService.onCategories((data) => {
            setCategoryArg(data.argentina);
            setCategoryInter(data.internacional);
        });
    };

    if (!room) {
        return (
            <View style={[styles.container, styles.centeredContent]}>
                <Text style={styles.waitingText}>Sala no encontrada</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{room.roomName}</Text>
                    <Text style={styles.subtitle}>Ronda: {gameState?.round}</Text>
                </View>

                {gameState?.state === "WAITING" && (
                    <>
                        <View style={styles.playerListContainer}>
                            <PlayerList players={room.players} voteMenu={false} />
                        </View>
                        <View style={styles.centeredContent}>
                            {isHost ? (
                                <Button
                                    label="Iniciar"
                                    onPress={handleChooseCategory}
                                    variant="primary"
                                />
                            ) : (
                                <Text style={styles.waitingText}>
                                    Esperando a que el anfitrión comience el juego...
                                </Text>
                            )}
                        </View>
                    </>
                )}

                {gameState?.state === "CHOOSING_CATEGORY" && (
                    <View style={styles.centeredContent}>
                        {isHost ? (
                            <CategorySelection
                                argentina={categoryArg}
                                internacional={categoryInter}
                            />
                        ) : (
                            <Text style={styles.waitingText}>
                                Esperando a que el anfitrión elija categorías...
                            </Text>
                        )}
                    </View>
                )}

                {gameState?.state === "PLAYING" && (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            Categoria: {gameState.category} | Region: {gameState.region}
                        </Text>

                        <View style={styles.wordContainer}>
                            <Text style={styles.wordText}>
                                {showWord ? `${gameState.word}` : "***"}
                            </Text>
                            <IconButton
                                icon={showWord ? "visibility-off" : "visibility"}
                                onPress={() => setShowWord(!showWord)}
                                variant="ghost"
                                additionalStyles={{
                                    container: styles.showWordButton,
                                    icon: { fontSize: 24 },
                                }}
                            />
                        </View>
                        <PlayerList players={room.players} voteMenu={true} />
                    </View>
                )}

                {gameState?.state === "END" && (
                    <View style={styles.centeredContent}>
                        <Text style={styles.title}>Partida finalizada</Text>
                        {impostorCaught ? (<>
                                <Text style={styles.infoText}>El impostor fue atrapado!</Text>
                            </>)
                        : (<>
                                <Text style={styles.infoText}>El impostor no fue decubierto</Text>
                            </>)}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

