import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform} from "react-native";
import { useTheme } from "@/components/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter} from "expo-router";

const ProfileCard = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const [name, setName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string>("");

    const STORAGE_KEY = "player_profile";

    const saveProfile = async (profileData: { name: string; profilePicture: string }) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
        } catch (error) {
            console.error("Error saving profile:", error);
        }
    };

    const loadProfile = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedProfile) {
                const { name, profilePicture } = JSON.parse(savedProfile);
                setName(name);
                setProfilePicture(profilePicture);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleEditName = () => {
        if (isEditingName) {
            saveProfile({ name, profilePicture }).then(() => {
                router.replace('/buscar-sala');
            });
        }
        setIsEditingName(!isEditingName);
    };

    const handleChoosePicture = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setProfilePicture(base64Image);
            await saveProfile({ name, profilePicture: base64Image });
        }
    };

    const defaultPictureImage = require("../../assets/images/default-pfp.png");

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            backgroundColor: colors.CARD_BACKGROUND,
            borderRadius: 12,
            margin: 16,
            gap: 24,
        },
        profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.BACKGROUND,
        },
        avatarSection: {
            gap: 8,
            alignItems: "center",
        },
        avatarLabel: {
            color: colors.TEXT_SECONDARY,
            fontSize: 16,
            fontWeight: "bold",
        },
        nameSection: {
            gap: 8,
        },
        nameLabel: {
            color: colors.TEXT_SECONDARY,
            fontSize: 16,
            fontWeight: "bold",
        },
        nameText: {
            fontSize: 24,
            fontWeight: "bold",
            color: colors.TEXT,
        },
        editNameInput: {
            fontSize: 24,
            fontWeight: "bold",
            color: colors.TEXT,
            borderBottomWidth: 1,
            borderBottomColor: colors.PRIMARY,
            minWidth: 150,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.avatarSection}>
                <Text style={styles.avatarLabel}>Avatar</Text>
                <TouchableOpacity onPress={handleChoosePicture}>
                    {profilePicture ? (
                        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
                    ) : (
                        <Image source={defaultPictureImage} style={styles.profileImage} />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.nameSection}>
                {isEditingName ? (
                    <TextInput
                        style={styles.editNameInput}
                        value={name}
                        onChangeText={setName}
                        onBlur={handleEditName}
                        autoFocus={true}
                    />
                ) : (
                    <TouchableOpacity onPress={handleEditName}>
                        <Text style={styles.nameLabel}>Nombre</Text>
                        <Text style={styles.nameText}>{name}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default ProfileCard;
