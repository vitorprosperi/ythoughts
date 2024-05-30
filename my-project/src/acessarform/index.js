import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, TouchableOpacity, View, Text, Alert } from "react-native";
import { auth, db } from "../../Firebase/FirebaseConnection";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';

export default function AcessarAnotacao({ route }) {
    const { anotacaoTexto, id } = route.params; // Obtém o texto da anotação passado como parâmetro
    const [novoTexto, setNovoTexto] = useState(anotacaoTexto);
    const [selectedEmotion, setSelectedEmotion] = useState('');
    const [emotions, setEmotions] = useState([]);

    useEffect(() => {
        fetchEmotions();
    }, []);

    const fetchEmotions = async () => {
        try {
            const emotionsDocRef = doc(db, 'emocao', 'jUzo1MKnoYnzsuxi1pEm');
            const docSnapshot = await getDoc(emotionsDocRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                console.log('Emoções:', data);
                setEmotions([
                    data.emocao1,
                    data.emocao2,
                    data.emocao3,
                    data.emocao4,
                ]);
            } else {
                console.error('Documento de emoções não encontrado');
                Alert.alert('Erro', 'Documento de emoções não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar emoções:', error.message);
            Alert.alert('Erro ao buscar emoções:', error.message);
        }
    };

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

            // Atualiza o documento da anotação no Firestore com o novo texto e emoção selecionada
            await setDoc(anotacaoDocRef, { 
                anotacao: novoTexto,
                emocao: selectedEmotion
            }, { merge: true });

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
            <Picker
                selectedValue={selectedEmotion}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedEmotion(itemValue)}
            >
                <Picker.Item label="Selecione uma emoção" value="" style={styles.pickerItem} />
                {emotions.map((emotion, index) => (
                    <Picker.Item 
                        key={index} 
                        label={emotion} 
                        value={emotion} 
                        style={styles.pickerItem} 
                    />
                ))}
            </Picker>
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
        height: '40%',
        textAlignVertical: 'top', // Alinha o texto na parte superior
    },
    picker: {
        height: 50,
        width: '90%',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
    },
    pickerItem: {
        fontSize: 16,
        color: 'black', // Cor do texto para garantir que seja visível
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
