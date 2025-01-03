import {StyleSheet, View} from "react-native";
import {useTheme} from "@/components/ThemeProvider";

type CategorySelectionProps = {
    categories: {
        argentina: string[];
        internacional: string[];
    };
}

export default function CategorySelection({ categories }: CategorySelectionProps) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.CARD_BACKGROUND
        }
    })

    const handleBanCategory = () => {

    }

    return (
        <View style={styles.container}>

        </View>
    )
}
