import {StyleSheet, View} from "react-native";
import {useTheme} from "@/components/ThemeProvider";

interface Props {
    width: number;
    orientation?: "horizontal" | "vertical";
    dividerStyles?: any;
}

export default function Divider({ width = 1, orientation = 'horizontal', dividerStyles }: Props) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        dividerContainer: {
            width: orientation === "horizontal" ? "100%" : width,
            height: orientation === "vertical" ? "100%" : width,
            backgroundColor: colors.TEXT_SECONDARY,
        }
    })

    return (
        <View style={[styles.dividerContainer, dividerStyles]}></View>
    )
}
