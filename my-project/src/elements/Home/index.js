import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";

export function Home(){
    const navigation = useNavigation();

    const handleLogout = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            navigation.navigate('Login'); // Redirecionar para a tela de login
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };

    return(
        <View>
            <Text>Vitor, Você Conseguiu!</Text>
            <Button title="Sair" onPress={handleLogout} />
        </View>
    );
}

export default Home;
