import { StyleSheet, View, Text, FlatList } from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import Button from "../Button";
import { useState } from "react";
import React from "react";
import IconButton from "@/components/IconButton";
import Checkbox from "expo-checkbox";
import socketService from "@/services/SocketService";

export type CategorySelectionProps = {
    argentina: string[];
    internacional: string[];
}

export default function CategorySelection({ argentina, internacional }: CategorySelectionProps) {
    const [isBanning, setIsBanning] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<"Argentina" | "Internacional">("Argentina");
    const [bannedCategories, setBannedCategories] = useState<string[]>([]);
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            padding: 16,
            backgroundColor: colors.CARD_BACKGROUND,
            borderRadius: 12,
            margin: 16,
            gap: 16,
            flex: 1,
        },
        categoryRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
        },
        checkbox: {
            borderColor: colors.BORDER,
            borderWidth: 1,
            borderRadius: 5,
            width: 24,
            height: 24,
        },
        banTitle: {
          color: colors.TEXT,
          fontSize: 20,
          fontFamily: "Lexend-SemiBold",
        },
        categoryText: {
            fontSize: 16,
            color: colors.TEXT,
        },
    });

    const handleBanToggle = (category: string) => {
        setBannedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((item) => item !== category)
                : [...prev, category]
        );
    };

    const handleSelectAll = () => {
        const categories = selectedRegion === "Argentina" ? argentina : internacional;
        const allBanned = categories.every((cat) => bannedCategories.includes(cat));
        setBannedCategories(allBanned ? [] : categories);
    };

    const handleRegionSelect = (region: "Argentina" | "Internacional") => {
        setSelectedRegion(region);
        setIsBanning(true);
    };

    const handleConfirmar = ()=> {
        socketService.startGame(socketService.getJoinedRoom(), selectedRegion, bannedCategories);
    }

    const categoriesToShow = selectedRegion === "Argentina" ? argentina : internacional;

    return (
        <View style={styles.container}>
            {isBanning ? (
                <>
                    <IconButton
                        onPress={() => setIsBanning(false)}
                        label="Volver"
                        icon="arrow-back"
                        variant="secondary"
                    />
                    <Button label="Seleccionar todo" onPress={handleSelectAll} />
                    <Text style={styles.banTitle}>Deshabilitar categorias</Text>
                    <FlatList
                        data={categoriesToShow}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View style={styles.categoryRow}>
                                <Text style={styles.categoryText}>{item}</Text>
                                <Checkbox
                                    value={bannedCategories.includes(item)}
                                    onValueChange={() => handleBanToggle(item)}
                                    style={styles.checkbox}
                                    color={bannedCategories.includes(item) ? colors.SECONDARY : colors.BORDER}
                                />
                            </View>
                        )}
                    />
                    <Button
                        label="Confirmar"
                        onPress={handleConfirmar}
                        variant="primary"
                    />
                </>
            ) : (
                <>
                    <Button label="Argentina" onPress={() => handleRegionSelect("Argentina")} variant="info" />
                    <Button label="🌎 Internacional" onPress={() => handleRegionSelect("Internacional")} variant="success" />
                </>
            )}
        </View>
    );
}
