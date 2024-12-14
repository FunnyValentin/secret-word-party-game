import {Link, Stack} from "expo-router";
import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function NotFoundScreen() {
    return(
        <>
            <Stack.Screen options={{ headerShown: false }}/>
            <View style={styles.container}>
                <Text style={styles.text}>No se encontró la página :(</Text>
                <Link href="/" style={styles.link}>Volver al menú principal</Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#292727",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        color: "#eaeaea",
        paddingVertical: 24,
    },
    link: {
        color: "#0b58ef",
        textDecorationLine: "underline",
    },
})