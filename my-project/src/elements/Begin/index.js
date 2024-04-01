import React, { useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from "../../../Firebase/FirebaseConnection";
import { collection, addDoc } from "firebase/firestore";

export function Begin() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');

    const sendData = async () => {
        try {
            await addDoc(collection(db, "usuarios"), {
                nome: nome,
                idade: idade
            });
            console.log("Dados enviados com sucesso para o Firestore!");
            navigation.navigate('Home');
        } catch (error) {
            console.error("Erro ao enviar dados para o Firestore: ", error);
        }
    };

    const signOut = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            navigation.navigate('Login');
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };

    return (
        <View>
            <Text>Antes de Começarmos Gostaríamos de Algumas Informações!</Text>
            <Text>Nome</Text>
            <TextInput
                value={nome}
                onChangeText={setNome}
            />
            <Text>Idade</Text>
            <TextInput
                value={idade}
                onChangeText={setIdade}
            />
            <Button title="Enviar" onPress={sendData} />
            <Button title="Sair" onPress={signOut} />
        </View>
    );
}
