import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import Button from "@/components/Button";
import {Link, useRouter} from "expo-router";


const imageSource = require("../assets/images/background-image.jpeg"); // Ensure the path is correct

export default function Index() {
    const router = useRouter();

    const handleButtonPress = () => {
        router.push("/buscar-sala")
    };

    return (
        <ImageBackground source={imageSource} style={styles.backgroundImage}>
            <View style={styles.overlay}>
                <View style={styles.buttonContainer}>
                    <Button label="BUSCAR SALA" onPress={handleButtonPress} variant="primary"></Button>
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
