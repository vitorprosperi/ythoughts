import React from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";

export default function Home(){
    const navigation = useNavigation();

    function abrirform(){
       navigation.navigate('addform');
    }

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
            <TouchableOpacity onPress={abrirform}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../tcc/imagens/mais.png')}
                        style={styles.image}
                    />
                </View>
            </TouchableOpacity>
            <View>    
                <Text style={styles.text}>Vitor, Você Conseguiu!</Text>
                <Button title="Sair" onPress={signOut} />
            </View>    
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    image: {
        width: 35,
        height: 35,
    },
    text: {
        marginTop: 50,
        fontSize: 20,
    },
});

