import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../../Firebase/FirebaseConnection"; // Importe o módulo de autenticação do Firebase
import { useNavigation } from "@react-navigation/native";
import Form from "../Login";

export default function Perfil(){

    const navigation = useNavigation();

    const handleLogout = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            // Coloque aqui a navegação para a tela de login ou qualquer outra ação que deseje realizar após o logout
            navigation.replace('Login');
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };

    return(
        <View>
            <Text>Oi Usuário</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}
