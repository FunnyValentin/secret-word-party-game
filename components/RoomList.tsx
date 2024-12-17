import React, { useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { useFonts } from "expo-font";
import IconButton from "@/components/IconButton";
import Divider from "@/components/Divider";
import { Room } from "@/types/Types";

const MyComponent = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    });
    const { colors } = useTheme();

    const createRoom = () => {
        const room: Room = {
            roomName: "Nueva Sala",
            isPasswordProtected: false,
            password: "",
            players: [],
            maxPlayers: 20,
            broadcast: () => {},
            addPlayer: () => {},
            removePlayer: () => {},
        };
        setRooms((prevRooms) => [...prevRooms, room]);
    };

    const reloadRooms = () => {
        // Implement room reloading logic here
        console.log("Reloading rooms...");
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            padding: 16,
            backgroundColor: colors.CARD_BACKGROUND,
            borderRadius: 12,
            margin: 16,
            gap: 24,
            flex: 1
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 20,
        },
        title: {
            fontFamily: "Lexend-SemiBold",
            color: colors.TEXT,
            fontSize: 18,
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
        },
        emptyText: {
            textAlign: "center",
            color: colors.TEXT,
            marginTop: 20,
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
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <IconButton
                    icon="add"
                    onPress={createRoom}
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
                    <Text style={styles.headerText}>Protegido</Text>
                </View>
                <FlatList
                    data={rooms}
                    renderItem={({ item }) => (
                        <View style={styles.roomItem}>
                            <Text style={{ flex: 1, color:colors.TEXT }}>{item.roomName}</Text>
                            <Text style={{ flex: 1, textAlign: "center", color:colors.TEXT }}>
                                {item.players.length}/{item.maxPlayers}
                            </Text>
                            <Text style={{ flex: 1, textAlign: "right", color:colors.TEXT }}>
                                {item.isPasswordProtected ? "Sí" : "No"}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No hay salas disponibles</Text>
                    }
                    keyExtractor={(item, index) => `${item.roomName}-${index}`}
                />
            </View>
        </View>
    );
};

export default MyComponent;

