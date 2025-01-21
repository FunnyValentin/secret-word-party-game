import React, {useEffect, useState} from "react";
import {SafeAreaView, ScrollView, StyleSheet, Text, View, Image} from "react-native";
import {useTheme} from "@/components/ThemeProvider";
import socketService, {GameState, Room} from "@/services/SocketService";
import Button from "@/components/Button";
import PlayerList from "@/components/game-screen-components/PlayerList";
import CategorySelection from "@/components/game-screen-components/CategorySelection";
import IconButton from "@/components/IconButton";
import {router} from "expo-router";
import ThemeSelector from "@/components/ThemeSelector";

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
        impostorContainer: {
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
        },
        impostorAvatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginTop: 5,
            marginBottom: 5,
            borderWidth: 2,
            borderColor: colors.TEXT,
        },
        bottomButtonContainer: {
            position: 'absolute',
            bottom: 20,
            left: 16,
            right: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        exitButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 30,
        },
        skipButtonContainer: {
            position: 'relative',
            marginVertical: 10,
            alignItems: 'center',
            paddingHorizontal: 16,
        }
    });

    useEffect(() => {
        const handleRoomInfo = (updatedRoom: Room) => {
            setRoom({ ...updatedRoom });
            setIsHost(socketService.getSocket()?.id === updatedRoom.players.find(p => p.isHost)?.id);
            setGameState({ ...updatedRoom.gameState });
        };

        socketService.onRoomInfo(handleRoomInfo);
        socketService.getRoomInfo(socketService.getJoinedRoom());

        socketService.onRoundResult(setImpostorCaught)

        return () => {
            socketService.offRoomInfo(handleRoomInfo);
        };
    }, []);

    const handleDisconnect = () => {
        socketService.setJoinedRoom("");
        socketService.disconnectPlayer();
        router.push("/buscar-sala");
    }

    const handleChooseCategory = () => {
        socketService.setChoosingCategory(socketService.getJoinedRoom());
        socketService.onCategories((data) => {
            setCategoryArg(data.argentina);
            setCategoryInter(data.internacional);
        });
    };

    const handleNextRound = () => {
        const roomCode = socketService.getJoinedRoom();
        socketService.nextRound(roomCode);
    }

    const handleSkipRound = () => {
        const roomCode = socketService.getJoinedRoom();
        socketService.skipRound(roomCode);
    }

    if (socketService.getJoinedRoom() == '') {
        return (
            <View style={[styles.container, styles.centeredContent]}>
                <Text style={styles.waitingText}>NO ESTAS CONECTADO A UNA SALA</Text>
            </View>
        );
    }

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
                            <PlayerList
                                players={room.players}
                                voteMenu={false}
                                votes={room.gameState.votes}
                            />
                        </View>
                        <View style={styles.centeredContent}>
                            {room.players.length >= 3 ? (
                                isHost ? (
                                    <Button
                                        label="Iniciar"
                                        onPress={handleChooseCategory}
                                        variant="primary"
                                    />
                                ) : (
                                    <Text style={styles.waitingText}>
                                        Esperando a que el anfitrión comience el juego...
                                    </Text>
                                )
                            ) : (
                                <Text style={styles.waitingText}>
                                    Esperando a que haya jugadores suficientes...
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
                        <PlayerList
                            players={room.players}
                            voteMenu={true}
                            votes={room.gameState.votes}
                        />
                        {isHost && (
                            <View style={styles.skipButtonContainer}>
                                <IconButton
                                    icon="skip-next"
                                    onPress={handleSkipRound}
                                    variant="secondary"
                                    label="Saltear ronda"
                                    additionalStyles={{
                                        container: styles.exitButton,
                                        icon: { fontSize: 24 },
                                        text: { fontSize: 16 },
                                    }}
                                />
                            </View>
                        )}
                    </View>
                )}

                {gameState?.state === "END" && (
                    <View style={styles.centeredContent}>
                        <Text style={styles.title}>Ronda finalizada</Text>
                        {impostorCaught ? (
                            <>
                                <Text style={styles.infoText}>¡El impostor fue atrapado!</Text>
                            </>
                        ) : (
                            <Text style={styles.infoText}>El impostor no fue descubierto</Text>
                        )}

                        {room.players.find(p => p.id == gameState.impostorID) && (
                            <View style={styles.impostorContainer}>
                                <Text style={styles.infoText}>
                                    ¡El impostor era {room.players.find(p => p.id == gameState.impostorID)?.name}!
                                </Text>
                                <Image
                                    source={{ uri: room.players.find(p => p.id == gameState.impostorID)?.avatar }}
                                    style={styles.impostorAvatar}
                                />
                                <Text style={styles.waitingText}>
                                    Puntaje: {room.players.find(p => p.id == gameState.impostorID)?.score}
                                </Text>
                            </View>
                        )}
                        {room.players.length >= 3 ? (
                            isHost ? (
                                <>
                                    <Button
                                        label="Nueva partida"
                                        variant="primary"
                                        onPress={handleNextRound}
                                    />
                                    <Button
                                        label="Cambiar categorias"
                                        variant="secondary"
                                        onPress={handleChooseCategory}
                                        additionalStyles={{
                                            container: { marginTop: 15, height: 40, width: 200 },
                                            label: { fontSize: 14 },
                                        }}
                                    />
                                </>
                            ) : (
                                <Text style={styles.infoText}>
                                    Esperando que el anfitrión empiece una nueva partida
                                </Text>
                            )
                        ) : (
                            <Text style={styles.waitingText}>
                                Esperando a que haya jugadores suficientes...
                            </Text>
                        )}

                    </View>
                )}

                {gameState?.state === "SKIPPED" && (
                    <View style={styles.centeredContent}>
                        <Text style={styles.title}>Ronda salteada</Text>

                        {room.players.find(p => p.id == gameState.impostorID) && (
                            <View style={styles.impostorContainer}>
                                <Text style={styles.infoText}>
                                    ¡El impostor era {room.players.find(p => p.id == gameState.impostorID)?.name}!
                                </Text>
                                <Image
                                    source={{ uri: room.players.find(p => p.id == gameState.impostorID)?.avatar }}
                                    style={styles.impostorAvatar}
                                />
                            </View>
                        )}
                        {room.players.length >= 3 ? (
                            isHost ? (
                                <>
                                    <Button
                                        label="Nueva partida"
                                        variant="primary"
                                        onPress={handleNextRound}
                                    />
                                    <Button
                                        label="Cambiar categorias"
                                        variant="secondary"
                                        onPress={handleChooseCategory}
                                        additionalStyles={{
                                            container: { marginTop: 15, height: 40, width: 200 },
                                            label: { fontSize: 14 },
                                        }}
                                    />
                                </>
                            ) : (
                                <Text style={styles.infoText}>
                                    Esperando que el anfitrión empiece una nueva partida
                                </Text>
                            )
                        ) : (
                            <Text style={styles.waitingText}>
                                Esperando a que haya jugadores suficientes...
                            </Text>
                        )}

                    </View>
                )}
            </ScrollView>
            <View style={styles.bottomButtonContainer}>
                <ThemeSelector />
                <IconButton
                    icon="exit-to-app"
                    onPress={handleDisconnect}
                    variant="danger"
                    label="Salir"
                    additionalStyles={{
                        container: styles.exitButton,
                        icon: { fontSize: 24 },
                        text: { fontSize: 16 },
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

