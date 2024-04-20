import React from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";

export default function Home(){
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
            <View style={styles.container} >
                <Image
                    source={require('../../../tcc/imagens/mais.png')}
                    style={styles.image}
                />
             </View>   
            <Text>Vitor, Você Conseguiu!</Text>
            <Button title="Sair" onPress={signOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-end', // Alinha os itens à direita
        justifyContent: 'center', // Centraliza verticalmente
        paddingRight: 20, // Espaçamento à direita para evitar que a imagem fique colada à borda
    },
    image: {
        width: 35,
        height: 35,
    },
});
