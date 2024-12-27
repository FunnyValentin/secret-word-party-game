import { useState } from "react";

type ValidationErrors = { [key: string]: string };

interface RoomValidation {
    roomName: string;
    isPasswordProtected: boolean;
    password: string;
    maxPlayers: string;
}

const useRoomValidation = () => {
    const [errors, setErrors] = useState<ValidationErrors>({});

    const validateRoom = (fields: RoomValidation): boolean => {
        const newErrors: ValidationErrors = {};

        // Validate room name
        if (fields.roomName.trim().length === 0) {
            newErrors.roomName = "El nombre de la sala es obligatorio";
        }

        // Validate password (if required)
        if (fields.isPasswordProtected && fields.password.trim().length === 0) {
            newErrors.password = "La contraseña es obligatoria";
        }

        // Validate max players
        const maxPlayersNum = parseInt(fields.maxPlayers, 10);
        if (isNaN(maxPlayersNum) || maxPlayersNum < 2 || maxPlayersNum > 21) {
            newErrors.maxPlayers = "El número de jugadores debe estar entre 3 y 20";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetErrors = () => {
        setErrors({});
    };

    return { errors, validateRoom, resetErrors };
};

export default useRoomValidation;
