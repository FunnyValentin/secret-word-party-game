import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import Button from "@/components/Button";
import {Link, useRouter} from "expo-router";
import React from "react";


const imageSource = require("../assets/images/background-image.jpeg"); // Ensure the path is correct

export default function Index() {
    const router = useRouter();

    const buscarSala = () => {
        router.push("/buscar-sala")
    };

    const comoJugar = () => {
        router.push("/como-jugar")
    };

    return (
        <ImageBackground source={imageSource} style={styles.backgroundImage}>
            <View style={styles.overlay}>
                <View style={styles.buttonContainer}>
                    <Button
                        label="BUSCAR SALA"
                        onPress={buscarSala}
                        variant="primary"
                    />
                    <Button
                        label="COMO JUGAR"
                        variant="secondary"
                        onPress={comoJugar}
                        additionalStyles={{
                            container: { marginTop: 15, height: 40, width: 200, alignSelf: "center" },
                            label: { fontSize: 14 },
                        }}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        width: "100%",
        height: "100%",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Optional: Add a semi-transparent overlay
    },
    text: {
        color: "#fff",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        position: "absolute",
        bottom: "10%",
        alignSelf: "center",
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
