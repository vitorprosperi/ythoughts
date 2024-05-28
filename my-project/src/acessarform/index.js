import React from "react";
import { TextInput, StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { useState } from "react";
import { auth, db } from "../../Firebase/FirebaseConnection";
import { doc, setDoc } from "firebase/firestore";

export default function AcessarAnotacao({ route }) {
    const { anotacaoTexto, id } = route.params; // Obtém o texto da anotação passado como parâmetro
    const [novoTexto, setNovoTexto] = useState(anotacaoTexto);

    const atualizarform = async () => {
        try {
            const user = auth.currentUser; // Obtém o usuário autenticado
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            const userID = user.uid; // Obtém o UID do usuário autenticado
            const userDocRef = doc(db, 'usuarios', userID); // Referência ao documento do usuário
            const anotacaoDocRef = doc(userDocRef, 'anotacoes', id); // Referência à anotação específica

            // Atualiza o documento da anotação no Firestore com o novo texto
            await setDoc(anotacaoDocRef, { anotacao: novoTexto }, { merge: true });

            console.log('Anotação atualizada com sucesso!');
            Alert.alert("Salvo com sucesso!");
        } catch (error) {
            console.error('Erro ao atualizar a anotação:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                multiline={true}
                value={novoTexto} // Define o valor do TextInput como o texto da anotação
                onChangeText={(text) => setNovoTexto(text)} // Atualiza o estado novoTexto conforme o usuário digita
            />
            <TouchableOpacity
                style={styles.button}
                onPress={atualizarform}
            >
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white', // Define o fundo da tela como branco
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 20,
        height: '60%',
        textAlignVertical: 'top', // Alinha o texto na parte superior
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        borderRadius: 30,
        margin: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});
