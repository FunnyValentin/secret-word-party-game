import {StyleSheet, View} from "react-native";
import {useTheme} from "@/components/ThemeProvider";

export default function GameScreen( ) {

    const {colors} = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND
        }
    })

    return(
        <View style={styles.container}>

        </View>
    )
}
