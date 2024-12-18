import React, {useState} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    Switch,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard, TouchableWithoutFeedback
} from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import { useFonts } from "expo-font";
import IconButton from "@/components/IconButton";
import Divider from "@/components/Divider";
import { Room } from "@/types/Types";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const MyComponent = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [fontsLoaded] = useFonts({
        "Lexend-SemiBold": require("../assets/fonts/Lexend-SemiBold.ttf"),
    });
    const { colors } = useTheme();
    const router = useRouter();
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [password, setPassword] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("4");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);

    const handleCreateRoom = () => {
        setIsCreatingRoom(true);
    };

    const handleBackToList = () => {
        setIsCreatingRoom(false);
        resetForm();
    };

    const resetForm = () => {
        setRoomName("");
        setIsPasswordProtected(false);
        setPassword("");
        setMaxPlayers("4");
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (roomName.trim().length === 0) {
            newErrors.roomName = "El nombre de la sala es obligatorio";
        }

        if (isPasswordProtected && password.trim().length === 0) {
            newErrors.password = "La contraseña es obligatoria";
        }

        const maxPlayersNum = parseInt(maxPlayers, 10);
        if (isNaN(maxPlayersNum) || maxPlayersNum < 2 || maxPlayersNum > 20) {
            newErrors.maxPlayers = "El número de jugadores debe estar entre 2 y 20";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitRoom = () => {
        if (validateForm()) {
            // Implement room creation logic here
            console.log("Creating room:", { roomName, isPasswordProtected, password, maxPlayers });
            handleBackToList();
        }
    };

    const reloadRooms = () => {
        // Implement room reloading logic here
        console.log("Reloading rooms...");
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: "column",
            padding: 16,
            backgroundColor: colors.CARD_BACKGROUND,
            borderRadius: 12,
            margin: 16,
            gap: 24,
            flex: 1,
        },
        buttonContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 20,
        },
        title: {
            fontFamily: "Lexend-SemiBold",
            color: colors.TEXT,
            fontSize: 24,
            marginBottom: 16,
        },
        divider: {
            marginVertical: 15,
            width: "100%",
        },
        roomItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 12,
            backgroundColor: colors.BACKGROUND,
            borderRadius: 8,
            marginVertical: 4,
        },
        listContainer: {
            flex: 1,
        },
        listHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingBottom: 8,
        },
        headerText: {
            fontFamily: "Lexend-SemiBold",
            color: colors.TEXT,
            fontSize: 14,
            marginBottom: 8,
        },
        emptyText: {
            textAlign: "center",
            color: colors.TEXT,
            marginTop: 20,
        },
        input: {
            color: colors.TEXT,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.BORDER,
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
        },
        label: {
            color: colors.TEXT,
            marginBottom: 8,
            fontSize: 16,
            fontFamily: "Lexend-SemiBold",
        },
        switchContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
        },
        error: {
            color: colors.DANGER,
            fontSize: 14,
            marginTop: -8,
            marginBottom: 16,
        },
        passwordContainer: {
            position: 'relative',
        },
        passwordInput: {
            paddingRight: 50,
        },
        showPasswordButton: {
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: [{ translateY: -29 }],
        },
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>Cargando fuentes...</Text>
            </View>
        );
    }

    return (
        <>
                {isCreatingRoom ? (
                    <KeyboardAvoidingView
                        style={[styles.container, { flex: 1 }]}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 0} // Offset for Android
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1 }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={{ flexShrink: 1 }}>
                                    <View style={styles.buttonContainer}>
                                        <IconButton
                                            icon="arrow-back"
                                            onPress={handleBackToList}
                                            label="Volver"
                                            variant="secondary"
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.title}>Crear sala</Text>

                                        <Text style={styles.label}>Nombre de la sala</Text>
                                        <TextInput
                                            style={[styles.input, errors.roomName && { borderColor: colors.DANGER }]}
                                            value={roomName}
                                            onChangeText={setRoomName}
                                            placeholder="Ingrese el nombre de la sala"
                                            placeholderTextColor={colors.TEXT_SECONDARY}
                                            onBlur={() => Keyboard.dismiss()} // Ensure keyboard closes cleanly
                                        />
                                        {errors.roomName && <Text style={styles.error}>{errors.roomName}</Text>}

                                        <Text style={styles.label}>Número máximo de jugadores</Text>
                                        <TextInput
                                            style={[styles.input, errors.maxPlayers && { borderColor: colors.DANGER }]}
                                            value={maxPlayers}
                                            onChangeText={setMaxPlayers}
                                            keyboardType="numeric"
                                            placeholder="Ingrese el número máximo de jugadores"
                                            placeholderTextColor={colors.TEXT_SECONDARY}
                                            onBlur={() => Keyboard.dismiss()}
                                        />
                                        {errors.maxPlayers && <Text style={styles.error}>{errors.maxPlayers}</Text>}

                                        <View style={styles.switchContainer}>
                                            <Text style={styles.label}>Proteger con contraseña</Text>
                                            <Switch
                                                value={isPasswordProtected}
                                                onValueChange={setIsPasswordProtected}
                                                trackColor={{ false: '#7e7e7e', true: colors.PRIMARY_MUTED }}
                                                thumbColor={isPasswordProtected ? colors.PRIMARY : '#e2e2e2'}
                                            />
                                        </View>

                                        {isPasswordProtected && (
                                            <>
                                                <Text style={styles.label}>Contraseña</Text>
                                                <View style={styles.passwordContainer}>
                                                    <TextInput
                                                        style={[
                                                            styles.input,
                                                            styles.passwordInput,
                                                            errors.password && { borderColor: colors.DANGER }
                                                        ]}
                                                        value={password}
                                                        onChangeText={setPassword}
                                                        secureTextEntry={!showPassword}
                                                        placeholder="Ingrese la contraseña"
                                                        placeholderTextColor={colors.TEXT_SECONDARY}
                                                        onBlur={() => Keyboard.dismiss()}
                                                    />
                                                    <IconButton
                                                        icon={showPassword ? "visibility-off" : "visibility"}
                                                        onPress={() => setShowPassword(!showPassword)}
                                                        variant="ghost"
                                                        additionalStyles={{
                                                            container: styles.showPasswordButton,
                                                            icon: { fontSize: 24 }
                                                        }}
                                                    />
                                                </View>
                                                {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                                            </>
                                        )}

                                        <Button
                                            onPress={handleSubmitRoom}
                                            label="Crear sala"
                                            variant="primary"
                                            additionalStyles={{
                                                container: {alignSelf: "center", marginTop: 15},
                                            }}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.buttonContainer}>
                            <IconButton
                                icon="add"
                                onPress={handleCreateRoom}
                                variant="secondary"
                                label="Crear sala"
                            />
                            <IconButton
                                icon="refresh"
                                onPress={reloadRooms}
                                variant="secondary"
                                label="Recargar"
                            />
                        </View>
                        <Divider width={1} dividerStyles={styles.divider} />
                        <View style={styles.listContainer}>
                            <View style={styles.listHeader}>
                                <Text style={styles.headerText}>Nombre</Text>
                                <Text style={styles.headerText}>Jugadores</Text>
                                <Text style={styles.headerText}>Protegido</Text>
                            </View>
                            <FlatList
                                data={rooms}
                                renderItem={({ item }) => (
                                    <View style={styles.roomItem}>
                                        <Text style={{ flex: 1, color: colors.TEXT }}>{item.roomName}</Text>
                                        <Text style={{ flex: 1, textAlign: "center", color: colors.TEXT }}>
                                            {item.players.length}/{item.maxPlayers}
                                        </Text>
                                        <Text style={{ flex: 1, textAlign: "right", color: colors.TEXT }}>
                                            {item.isPasswordProtected ? "Sí" : "No"}
                                        </Text>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={styles.emptyText}>No hay salas disponibles</Text>}
                                keyExtractor={(item, index) => `${item.roomName}-${index}`}
                            />
                        </View>
                    </View>
                )}
            </>
    );
};

export default MyComponent;

