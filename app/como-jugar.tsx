import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import {useTheme} from "@/components/ThemeProvider";


export default function howToPlay() {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND,
            padding: 20,
        },
        title: {
            fontSize: 28,
            fontWeight: "bold",
            color: colors.TEXT,
            marginBottom: 20,
            textAlign: "center",
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: colors.TEXT_SECONDARY,
            marginBottom: 10,
        },
        text: {
            fontSize: 16,
            color: colors.TEXT,
            marginBottom: 15,
        },
        image: {
            width: "100%",
            resizeMode: 'contain',
        }
    });

    return(
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cómo Jugar</Text>

            <Text style={styles.sectionTitle}>1. Crear una Sala</Text>
            <Text style={styles.text}>
                Para comenzar, selecciona "Crear sala" y configura el nombre de la sala, número máximo de jugadores y si deseas protegerla con una contraseña.
            </Text>

            <Text style={styles.sectionTitle}>2. Unirse a una Sala</Text>
            <Text style={styles.text}>
                Los jugadores pueden unirse a una sala existente seleccionándola de la lista. Si la sala está protegida, se pedirá una contraseña.
            </Text>

            <Text style={styles.sectionTitle}>3. Inicio del Juego</Text>
            <Text style={styles.text}>
                Una vez que todos los jugadores estén listos y haya al menos 3, el anfitrión podrá iniciar la partida. Para ello deberá elegir una región, y luego se le da la opción de deshabilitar categorias de palabras.
            </Text>

            <Text style={styles.sectionTitle}>4. Fase de votación</Text>
            <Text style={styles.text}>
                A todos los jugadores se les da la palabra secreta, excepto a uno de ellos, quien será el impostor. El objetivo de los jugadores es determinar quien de ellos es el impostor, a través de preguntas de si/no. La idea del juego es que las preguntas sean lo más generales posible, de forma que el impostor no descrubra la palabra.
            </Text>
            <Text style={styles.text}>
                Los jugadores pueden votar por quien creen que es el impostor, y una vez que todos hayan votado se muestra el resultado.
            </Text>

            <Image
                source={require('../assets/images/how_to_play_1.png')}
                style={styles.image}
            />

            <Text style={styles.sectionTitle}>5. Ganador</Text>
            <Text style={styles.text}>
                Si la mayoria de los jugadores votó por el impostor, no se suman puntos. Si el impostor no fue detectado, se le suma un punto a él.
                El anfitrión puede elegir iniciar una nueva partida
            </Text>
        </ScrollView>
    )
}
