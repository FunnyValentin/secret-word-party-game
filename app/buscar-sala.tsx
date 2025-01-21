import {StyleSheet, View, Text} from "react-native";
import {useTheme} from "@/components/ThemeProvider";
import {useFonts} from "expo-font";
import Divider from "@/components/Divider";
import ProfileCard from "@/components/room-list-components/ProfileCard";
import ThemeSelector from "@/components/ThemeSelector";
import RoomList from "@/components/room-list-components/RoomList";
import {useNetworkState} from "expo-network";
import {MaterialIcons} from "@expo/vector-icons";

export default function BuscarSala() {
    const { colors } = useTheme();
    const networkState = useNetworkState();

    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require('../assets/fonts/Lexend-SemiBold.ttf'),
    });

    if (!fontsLoaded) {
        return <Text>Cargando fuentes...</Text>;
    }

    if(!networkState.isConnected) {
        return (
            <View style={[styles.container, {backgroundColor: colors.BACKGROUND}]}>
                <Text style={[styles.title, {color: colors.TEXT}]}>No estas conectado</Text>
                <MaterialIcons
                    name="signal-cellular-off"
                    size={20}
                    color={colors.TEXT}
                    style={styles.icon}
                />
            </View>
        );
    }

    return(
        <View style={[styles.container, {backgroundColor: colors.BACKGROUND}]}>
            <Text style={[styles.title, {color: colors.TEXT}]}>Lista de salas</Text>
            <Divider width={1} dividerStyles={styles.titleDivider}></Divider>
            <Text style={[styles.subtitle,  {color: colors.TEXT}]}>Perfil</Text>
            <ProfileCard/>
            <Divider width={1} dividerStyles={styles.titleDivider}></Divider>
            <RoomList/>
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
        marginBottom: 15,
        width: "92%",
        alignSelf: "center",
    },
    subtitle: {
        paddingTop: 15,
        paddingLeft: 15,
        fontSize: 24,
        fontFamily: "Lexend-SemiBold",
    },
    icon: {
        marginTop: 20,
        alignSelf: "center",
    }
})
