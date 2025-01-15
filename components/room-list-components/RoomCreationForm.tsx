import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import IconButton from "@/components/IconButton";
import Button from "@/components/Button";
import React, {useState} from "react";
import {useTheme} from "@/components/ThemeProvider";
import useRoomValidation from "@/hooks/useRoomValidation";
import socketService from "@/services/SocketService";
import {router} from "expo-router";

type RoomCreationFormProps = {
    onBack: () => void;
    hostName: string;
    hostAvatar: string;
}

export default function RoomCreationForm({ onBack, hostName, hostAvatar }: RoomCreationFormProps) {
    const { errors, validateRoom, resetErrors } = useRoomValidation();
    const [roomName, setRoomName] = useState("");
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [password, setPassword] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("3");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmitRoom = () => {
        const isValid = validateRoom({
            roomName,
            isPasswordProtected,
            password,
            maxPlayers,
        });

        if (isValid) {
            handleCreateRoom()
            socketService.onRoomCreated(({ roomCode }) => {
                socketService.setJoinedRoom(roomCode)
                resetErrors();
                router.push("/game");
            });
        }
    };

    const handleCreateRoom = () => {
        socketService.createRoom({
            roomName: roomName,
            isPasswordProtected: isPasswordProtected,
            password: password,
            maxPlayers: parseInt(maxPlayers),
            hostName: hostName,
            hostAvatar: hostAvatar,
        });
    }

    const { colors } = useTheme();

    return(
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.CARD_BACKGROUND, flex: 1 }]}
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
                                onPress={onBack}
                                label="Volver"
                                variant="secondary"
                            />
                        </View>
                        <View>
                            <Text style={[styles.title, {color: colors.TEXT,}]}>Crear sala</Text>

                            <Text style={[styles.label, {color: colors.TEXT}]}>Nombre de la sala</Text>
                            <TextInput
                                style={[styles.input, {color: colors.TEXT, borderColor: colors.BORDER}, errors.roomName && { borderColor: colors.DANGER }]}
                                value={roomName}
                                onChangeText={setRoomName}
                                placeholder="Ingrese el nombre de la sala"
                                placeholderTextColor={colors.TEXT_SECONDARY}
                                onBlur={() => Keyboard.dismiss()} // Ensure keyboard closes cleanly
                            />
                            {errors.roomName && <Text style={[styles.error, {color: colors.DANGER,}]}>{errors.roomName}</Text>}

                            <Text style={[styles.label, {color: colors.TEXT,}]}>Número máximo de jugadores</Text>
                            <TextInput
                                style={[styles.input, {color: colors.TEXT, borderColor: colors.BORDER}, errors.maxPlayers && { borderColor: colors.DANGER }]}
                                value={maxPlayers}
                                onChangeText={setMaxPlayers}
                                keyboardType="numeric"
                                placeholder="Ingrese el número máximo de jugadores"
                                placeholderTextColor={colors.TEXT_SECONDARY}
                                onBlur={() => Keyboard.dismiss()}
                            />
                            {errors.maxPlayers && <Text style={[styles.error, {color: colors.DANGER,}]}>{errors.maxPlayers}</Text>}

                            <View style={styles.switchContainer}>
                                <Text style={[styles.label, {color: colors.TEXT}]}>Proteger con contraseña</Text>
                                <Switch
                                    value={isPasswordProtected}
                                    onValueChange={setIsPasswordProtected}
                                    trackColor={{ false: '#7e7e7e', true: colors.PRIMARY_MUTED }}
                                    thumbColor={isPasswordProtected ? colors.PRIMARY : '#e2e2e2'}
                                />
                            </View>

                            {isPasswordProtected && (
                                <>
                                    <Text style={[styles.label, {color: colors.TEXT}]}>Contraseña</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {color: colors.TEXT, borderColor: colors.BORDER},
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
                                    {errors.password && <Text style={[styles.error, {color: colors.DANGER,}]}>{errors.password}</Text>}
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
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        padding: 16,
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
        fontSize: 24,
        marginBottom: 16,
    },
    label: {
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
    input: {
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
})

