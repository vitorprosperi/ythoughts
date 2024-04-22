import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../../Firebase/FirebaseConnection'; // Certifique-se de importar 'auth' do seu arquivo de configuração do Firebase

const Sidebar = ({ navigation }) => {
    const signOut = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            navigation.navigate('Login');
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={signOut}>
                <Text>Sair</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Sidebar;
