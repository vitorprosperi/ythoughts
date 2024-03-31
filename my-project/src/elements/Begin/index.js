import React from "react";
import {View, Text, Button} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";

export function Begin(){

    const navigation = useNavigation();

    const signOut = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            navigation.navigate('Login');
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };
    return(
        <View>
            <Text>Antes de Começarmos Gostaráiamos de Algumas Informações!</Text>
            <Button title="Sair" onPress={signOut} />
        </View>
    );
}
