import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";
import { db } from "../../../Firebase/FirebaseConnection";
import { setDoc, doc} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Feather } from "@expo/vector-icons";

export function Cadastro() {
    const navigation = useNavigation();
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar a visibilidade da confirmação de senha

    const signUp = async () => {
        if (!nome || !idade || !email || !password || !confirmPassword) {
            Alert.alert('Todos os campos devem ser preenchidos.');
            return;
        }
        
        if (password !== confirmPassword) {
            Alert.alert('Os dois campos de senha devem ser iguais.');
            return;
        }
        
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userID = userCredential.user.uid;
    
            await setDoc(doc(db, "usuarios", userID), {
                nome: nome,
                idade: idade,
                email: email
            });
    
            console.log("Usuário cadastrado com sucesso! UID:", userID);
            console.log("Dados enviados com sucesso para o Firestore!");
            Alert.alert('Cadastrado com sucesso!\nVoltando ao Login...');
            navigation.navigate('Login');
        } catch (error) {
            console.log('Erro ao cadastrar usuário:', error.message);
            Alert.alert('Erro ao cadastrar usuário:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crie Seu Cadastro!</Text>
            <View style={styles.inputContainer}>
                <Feather name="user" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
            </View>
            <View style={styles.inputContainer}>
                <Feather name="calendar" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Idade"
                    value={idade}
                    onChangeText={setIdade}
                />
            </View>
            <View style={styles.inputContainer}>
                <Feather name="mail" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            <View style={styles.inputContainer}>
                <Feather name="lock" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    secureTextEntry={!showPassword} // Inverte a visibilidade da senha
                    onChangeText={setPassword}
                />
                <Feather
                    name={showPassword ? "eye" : "eye-off"} // Inverte o ícone do olho
                    size={24}
                    color="black"
                    style={styles.icon}
                    onPress={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Feather name="lock" size={24} color="black" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirme Sua Senha"
                    value={confirmPassword}
                    secureTextEntry={!showConfirmPassword} // Inverte a visibilidade da confirmação de senha
                    onChangeText={setConfirmPassword}
                />
                <Feather
                    name={showConfirmPassword ? "eye" : "eye-off"} // Inverte o ícone do olho
                    size={24}
                    color="black"
                    style={styles.icon}
                    onPress={() => setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword)}
                />
            </View>
            <TouchableOpacity 
                style={styles.buttonRegister} 
                onPress={signUp}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                )}
            </TouchableOpacity>
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
        color: 'green',
        fontSize: 28,
        marginTop: '14%',
        marginBottom: '8%',
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'black',
        marginBottom: 12,
    },
    icon: {
        padding: 10,
    },
    input: {
        flex: 1,
        height: 40,
    },
    buttonRegister: {
        backgroundColor: 'green',
        padding: 13,
        borderRadius: 30,
        marginTop: 14,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});