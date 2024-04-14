import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";
import { db } from "../../../Firebase/FirebaseConnection";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function Cadastro() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = async () => {
        if (!nome || !idade || !email || !password) {
            Alert.alert('Todos os campos devem ser preenchidos.');
            return;
        }
        
        try {
            // Cadastrar usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userID = userCredential.user.uid; // Obter o UID do usuário cadastrado
    
            // Salvar informações do usuário no Firestore associadas ao UID
            await addDoc(collection(db, "usuarios"), {
                userID: userID, // Associar as informações ao UID do usuário
                nome: nome,
                idade: idade,
                email: email // Você pode adicionar mais informações, se necessário
            });
    
            console.log("Usuário cadastrado com sucesso! UID:", userID);
            console.log("Dados enviados com sucesso para o Firestore!");
            Alert.alert('Cadastrado com sucesso!\nVoltando ao Login...');
            navigation.navigate('Login');
        } catch (error) {
            console.log('Erro ao cadastrar usuário:', error.message);
            Alert.alert('Erro ao cadastrar usuário:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crie Seu Cadastro!</Text>
            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
            />
            <Text style={styles.label}>Idade</Text>
            <TextInput
                style={styles.input}
                value={idade}
                onChangeText={setIdade}
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />
            <Text style={styles.label}>Senha</Text>
            <TextInput
                style={styles.input}
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
            />
            <Button title="Enviar" onPress={signUp} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
});