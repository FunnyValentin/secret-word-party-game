import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { useFonts } from "expo-font";
import IconButton from "@/components/IconButton";
import Divider from "@/components/Divider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoomCreationForm from "@/components/room-list-components/RoomCreationForm";
import socketService, { RoomListItem } from "@/services/SocketService";
import { router } from "expo-router";
import Button from "@/components/Button";

export default function RoomList() {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require("../../assets/fonts/Lexend-SemiBold.ttf"),
    });
    const { colors } = useTheme();
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [hostName, setHostName] = useState("");
    const [hostProfilePicture, setHostProfilePicture] = useState<string>("");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomListItem | null>(null);
    const [password, setPassword] = useState("");

    const STORAGE_KEY = "player_profile";

    useEffect(() => {
        loadProfile().then(() => console.log("Perfil cargado."));
        reloadRooms();
    }, []);

    const handleCreateRoom = () => {
        setIsCreatingRoom(true);
    };

    const loadProfile = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedProfile) {
                const { name, profilePicture } = JSON.parse(savedProfile);
                if (!name) {
                    alert("Por favor ingresa tu nombre");
                    return;
                }
                setHostName(name);
                setHostProfilePicture(profilePicture);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    const handleJoinRoom = (room: RoomListItem) => {
        if (room.isPasswordProtected && socketService.getJoinedRoom() != room.code) {
            setSelectedRoom(room);
            setShowPasswordModal(true);
        } else {
            connectToRoom(room, "");
        }
    };

    const reloadRooms = () => {
        socketService.getRooms();
        socketService.onRoomList((rooms) => setRooms(rooms));
    };

    const connectToRoom = (room: RoomListItem, password: string) => {
        if (socketService.getJoinedRoom() != room.code) {
            socketService.disconnectPlayer();
        }
        socketService.joinRoom({
            roomCode: room.code,
            password,
            playerName: hostName,
            playerAvatar: hostProfilePicture,
        });
        socketService.onJoinedRoom(({ roomCode }) => {
            socketService.setJoinedRoom(roomCode);
            setTimeout(() => {
                router.push("/game");
            }, 200);
        });
    };

    const handleModalSubmit = () => {
        if (selectedRoom) {
            connectToRoom(selectedRoom, password);
        }
        setPassword("");
        setSelectedRoom(null);
        setShowPasswordModal(false);
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            padding: 16,
            backgroundColor: colors.CARD_BACKGROUND,
            borderRadius: 12,
            margin: 16,
            gap: 24,
            flex: 1,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 20,
        },
        title: {
            fontFamily: "Lexend-SemiBold",
            color: colors.TEXT,
            fontSize: 24,
            marginBottom: 16,
        },
        divider: {
            marginVertical: 15,
            width: "100%",
        },
        roomItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 12,
            backgroundColor: colors.BACKGROUND,
            borderRadius: 8,
            marginVertical: 4,
        },
        listContainer: {
            flex: 1,
        },
        listHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingBottom: 8,
        },
        headerText: {
            fontFamily: "Lexend-SemiBold",
            color: colors.TEXT,
            fontSize: 14,
            marginBottom: 8,
        },
        emptyText: {
            textAlign: "center",
            color: colors.TEXT,
            marginTop: 20,
        },
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            width: "80%",
            backgroundColor: colors.CARD_BACKGROUND,
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
        },
        input: {
            width: "100%",
            borderWidth: 1,
            borderColor: colors.BORDER,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
            color: colors.TEXT,
            marginBottom: 20,
        },
        button: {
            marginTop: 10,
        },
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Cargando fuentes...</Text>
            </View>
        );
    }

    return (
        <>
            {isCreatingRoom ? (
                <RoomCreationForm
                    onBack={() => setIsCreatingRoom(false)}
                    hostName={hostName}
                    hostAvatar={hostProfilePicture}
                />
            ) : (
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <IconButton
                            icon="add"
                            onPress={handleCreateRoom}
                            variant="secondary"
                            label="Crear sala"
                        />
                        <IconButton
                            icon="refresh"
                            onPress={reloadRooms}
                            variant="secondary"
                            label="Recargar"
                        />
                    </View>
                    <Divider width={1} dividerStyles={styles.divider} />
                    <View style={styles.listContainer}>
                        <View style={styles.listHeader}>
                            <Text style={styles.headerText}>Nombre</Text>
                            <Text style={styles.headerText}>Jugadores</Text>
                            <Text style={styles.headerText}>Tiene contraseña</Text>
                        </View>
                        <FlatList
                            data={rooms}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.roomItem}
                                    onPress={() => handleJoinRoom(item)}
                                >
                                    <Text style={{ flex: 1, color: colors.TEXT }}>{item.roomName}</Text>
                                    <Text style={{ flex: 1, textAlign: "center", color: colors.TEXT }}>
                                        {item.currentPlayers}/{item.maxPlayers}
                                    </Text>
                                    <Text style={{ flex: 1, textAlign: "right", color: colors.TEXT }}>
                                        {item.isPasswordProtected ? "Sí" : "No"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No hay salas disponibles</Text>
                            }
                            keyExtractor={(item, index) => `${item.roomName}-${index}`}
                        />
                    </View>
                </View>
            )}
            <Modal visible={showPasswordModal} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Contraseña requerida</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            placeholder="Ingrese la contraseña"
                            placeholderTextColor={colors.TEXT_SECONDARY}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Button
                            label="Unirse"
                            onPress={handleModalSubmit}
                            variant="primary"
                            additionalStyles={{
                                container: {width: 160}
                            }}
                        />
                        <Button
                            label="Cancelar"
                            onPress={() => {
                                setShowPasswordModal(false);
                                setPassword("");
                            }}
                            variant="danger"
                            additionalStyles={{
                                container: {marginTop: 15, width: 120, height: 35}
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
}
