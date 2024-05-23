import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

export default function Perfil() {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userID = user.uid;
                    const userDocRef = doc(db, 'usuarios', userID);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setUserData(userData);
                    } else {
                        console.log("Documento do usuário não encontrado.");
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            navigation.replace('Login');
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };

    const handleEditPress = () => {
        // Mudar
    };

    return (
        <View style={styles.container}>
            {userData && (
                <View>
                    <Text style={styles.label}>Olá, {userData.nome}</Text>
                        <Text style={styles.info}>Aqui estão suas informações:</Text>
                    <TouchableOpacity style={styles.dados} onPress={handleEditPress}>
                        <Text style={styles.dadostext}>Nome: {userData.nome}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dados} onPress={handleEditPress}>
                        <Text style={styles.dadostext}>Email: {userData.email}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dados} onPress={handleEditPress}>
                        <Text style={styles.dadostext}>Idade: {userData.idade}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dados} onPress={handleEditPress}>
                        <Text style={styles.dadostext}>Seu Código: {userData.codigo}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Questionario')}>
                        <Text style={styles.dadostext}>Refazer Questionário</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity style={styles.buttonSignOut} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSignOut: {
        backgroundColor: 'red',
        padding: 13,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginTop: 'auto',     
        marginBottom: 10,      
    },
    label: {
        color: 'green',
        fontSize: 28,
        marginTop: '30%',
        marginBottom: '8%',
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    info:{
        fontSize: 23,
        paddingLeft: 10,
        marginBottom:30,
    },
    dados:{
        paddingLeft: 10,
        marginTop: 20,
        marginBottom: 20,
    },
    dadostext:{
        fontSize: 17,
    },

});
