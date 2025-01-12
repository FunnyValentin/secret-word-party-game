import React from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import { Player, socketService } from "@/services/SocketService";
import { useTheme } from "@/components/ThemeProvider";
import { useFonts } from "expo-font";
import IconButton from "@/components/IconButton";
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PlayerListProps = {
    players: Player[];
    voteMenu: boolean;
    votes: { [key: string]: string };
};

export default function PlayerList({ players, voteMenu, votes }: PlayerListProps) {
    const { colors } = useTheme();
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require('../../assets/fonts/Lexend-SemiBold.ttf'),
    });
    const currentID = socketService.getSocket()?.id;
    const hasVoted = currentID ? !!votes[currentID] : false;
    const votedPlayerID = currentID ? votes[currentID] : null;

    if (!fontsLoaded) {
        return <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando fuentes...</Text>;
    }

    const handleVote = (idVoted: string) => {
        const roomCode = socketService.getJoinedRoom();
        socketService.handleVote(roomCode, idVoted);
    };

    const styles = StyleSheet.create({
        listContainer: {
            flex: 1,
            width: "100%",
        },
        title: {
            fontSize: 36,
            color: colors.TEXT,
            alignSelf: "center",
            fontFamily: "Lexend-SemiBold",
        },
        listContent: {
            padding: 16,
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
        underlined: {
            textDecorationLine: "underline",
        },
        host: {
            color: colors.PRIMARY,
        },
        score: {
            fontSize: 14,
            color: colors.TEXT_SECONDARY,
        },
        voteIcon: {
            marginLeft: 10,
        },
    });

    const renderPlayer = ({ item }: { item: Player }) => (
        <View style={styles.playerContainer}>
            <Image
                source={item.avatar ? { uri: item.avatar } : require("../../assets/images/default-pfp.png")}
                style={styles.avatar}
            />
            <View style={styles.infoContainer}>
                {/* Underline the current player's name */}
                <Text
                    style={[
                        styles.name,
                        item.isHost && styles.host,
                        item.id === currentID && styles.underlined,
                    ]}
                >
                    {item.name || "Player"}
                </Text>
                <Text style={styles.score}>Puntos: {item.score}</Text>
            </View>
            {voteMenu && (socketService.getSocket()?.id != item.id) && !hasVoted && (
                <IconButton
                    icon="how-to-vote"
                    onPress={() => handleVote(item.id)}
                />
            )}
            {/* Show skull icon if this player was voted */}
            {votedPlayerID === item.id && (
                <MaterialCommunityIcons
                    name="skull-outline"
                    size={24}
                    color={colors.TEXT}
                    style={styles.voteIcon}
                />
            )}
        </View>
    );

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
