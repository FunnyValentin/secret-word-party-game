import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    Switch,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard, TouchableWithoutFeedback,
    TouchableOpacity, Alert
} from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { useFonts } from "expo-font";
import IconButton from "@/components/IconButton";
import Divider from "@/components/Divider";
import { Room } from "@/types/Types";
import Button from "@/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoomCreationForm from "@/components/room-list-components/RoomCreationForm";
import socketService, {RoomListItem} from "@/services/SocketService";

export default function RoomList () {
    const [rooms, setRooms] = useState<RoomListItem[]>([]);
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require("../../assets/fonts/Lexend-SemiBold.ttf"),
    });
    const { colors } = useTheme();
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [hostName, setHostName] = useState("");
    const [hostProfilePicture, setHostProfilePicture] = useState<string>("");

    const STORAGE_KEY = "player_profile";

    useEffect(() => {
        loadProfile().then(() => {
            console.log("Perfil cargado.");
            console.log(process.env.EXPO_PUBLIC_SOCKET_URL)
        });
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
                    alert("Por favor ingresa tu nombre")
                    return
                }
                setHostName(name);
                setHostProfilePicture(profilePicture);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    const handleJoinRoom = (room: RoomListItem) => {
        if (room.isPasswordProtected) {
            Alert.prompt(
                "Contraseña requerida",
                "Ingrese la contraseña de la sala",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Unirse",
                        onPress: (password) => connectToRoom(room, password || "")
                    }
                ],
                "secure-text"
            );
        } else {
            connectToRoom(room, "");
        }
    };

    const reloadRooms = () => {
        socketService.getRooms();
        socketService.onRoomList(( rooms ) => {
            setRooms(rooms)
        });
    }

    const connectToRoom = (room: RoomListItem, password: string) => {
        socketService.joinRoom({
            roomCode: room.code,
            password,
            playerName: hostName,
            playerAvatar: hostProfilePicture
        })
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
        input: {
            color: colors.TEXT,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.BORDER,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
        },
        label: {
            color: colors.TEXT,
            marginBottom: 8,
            fontSize: 16,
            fontFamily: "Lexend-SemiBold",
        }
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
                            ListEmptyComponent={<Text style={styles.emptyText}>No hay salas disponibles</Text>}
                            keyExtractor={(item, index) => `${item.roomName}-${index}`}
                        />
                    </View>
                </View>
            )}
        </>
    );
};

