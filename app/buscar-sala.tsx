import {StyleSheet, View, Text} from "react-native";
import {useTheme} from "@/components/ThemeProvider";
import {useFonts} from "expo-font";
import Divider from "@/components/Divider";
import ProfileCard from "@/components/ProfileCard";
import ThemeSelector from "@/components/ThemeSelector";



export default function BuscarSala() {
    const { colors } = useTheme();

    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require('../assets/fonts/Lexend-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
        return <Text>Cargando fuentes...</Text>;
    }

    return(
        <View style={[styles.container, {backgroundColor: colors.BACKGROUND}]}>
            <Text style={[styles.title, {color: colors.TEXT}]}>Lista de salas</Text>
            <Divider width={1} dividerStyles={styles.titleDivider}></Divider>
            <Text style={[styles.subtitle,  {color: colors.TEXT}]}>Perfil</Text>
            <ProfileCard/>
            <ThemeSelector/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        padding: 15,
        fontSize: 36,
        fontFamily: "Lexend-SemiBold",
        alignSelf: "center",
    },
    titleDivider: {
        width: "92%",
        alignSelf: "center",
    },
    subtitle: {
        paddingTop: 15,
        paddingLeft: 15,
        fontSize: 24,
        fontFamily: "Lexend-SemiBold",
    }
})