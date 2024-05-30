import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../../Firebase/FirebaseConnection";
import { getDoc, doc, collection, addDoc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';

export function Addform() {
    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const navigation = useNavigation();
    const [anotacao, setAnotacao] = useState('');
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

    const enviarAnotacaoFirestore = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            const userID = user.uid;
            const userDocRef = doc(db, 'usuarios', userID);
            const anotacoesCollectionRef = collection(userDocRef, 'anotacoes');

            const docRef = await addDoc(anotacoesCollectionRef, {
                anotacao: anotacao,
                emocao: selectedEmotion,
                data: dataFormatada,
            });

            console.log('Anotação enviada com ID:', docRef.id);
            console.log('Anotação:', anotacao);

            console.log('Anotação enviada com sucesso!');
            Alert.alert('Salvo!');
            setAnotacao('');
            setSelectedEmotion('');
        } catch (error) {
            console.error('Erro ao enviar anotação:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Querido Diário..."
                value={anotacao}
                onChangeText={setAnotacao}
                style={styles.textInput}
                multiline={true}
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
                        style={styles.pickerItem} // Aplicando estilo diretamente
                    />
                ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={enviarAnotacaoFirestore}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: '50%',
        textAlignVertical: 'top',
    },
    picker: {
        height: 50,
        width: '100%',
        marginTop: 10,
        backgroundColor: 'white',
    },
    pickerItem: {
        fontSize: 16,
        color: 'black', // Cor do texto para garantir que seja visível
    },
    button: {
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
