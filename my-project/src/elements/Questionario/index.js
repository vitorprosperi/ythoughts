import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';

export function Questionario(){
    return(
        <View>
            <Text>Antes de Começarmos, Algumas Perguntas Serão Feitas!</Text>
            <Button title="Sair"/>
        </View>
    );
}

export default Questionario;
