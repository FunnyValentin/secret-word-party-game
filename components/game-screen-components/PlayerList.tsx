import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { Player } from "@/services/SocketService";
import {useTheme} from "@/components/ThemeProvider";
import {useFonts} from "expo-font";

type PlayerListProps = {
    players: Player[];
};

export default function PlayerList({ players }: PlayerListProps) {
    const { colors } = useTheme();
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require('../../assets/fonts/Lexend-SemiBold.ttf'),
    });

    const styles = StyleSheet.create({
        listContainer: {
            flex: 1,
        },
        title: {
            fontSize: 36,
            color: colors.TEXT,
            alignSelf: "center",
            fontFamily: "Lexend-SemiBold",
        },
        listContent: {
            padding: 16,
            flexGrow: 1,
        },
        playerContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.BORDER,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        infoContainer: {
            flex: 1,
        },
        name: {
            fontSize: 16,
            fontWeight: "bold",
            color: colors.TEXT,
        },
        host: {
            color: colors.PRIMARY,
        },
        score: {
            fontSize: 14,
            color: colors.TEXT_SECONDARY,
        },
    });


    const renderPlayer = ({ item }: { item: Player }) => (
        <View style={styles.playerContainer}>
            {item.avatar && <Image
                source={item.avatar ? { uri: item.avatar }: require("../../assets/images/default-pfp.png")}
                style={styles.avatar}
            />}
            <View style={styles.infoContainer}>
                <Text style={[styles.name, item.isHost && styles.host]}>
                    {item.name || "Player"}
                </Text>
                <Text style={styles.score}>Puntos: {item.score}</Text>
            </View>
        </View>
    );

    if (!fontsLoaded) {
        return(
            <Text>Cargando fuentes...</Text>
        )
    }

    return (
        <View style={styles.listContainer}>
            <Text style={styles.title}>Jugadores</Text>
            <FlatList
                data={players}
                keyExtractor={(item) => item.id}
                renderItem={renderPlayer}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}
