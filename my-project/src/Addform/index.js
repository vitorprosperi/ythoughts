import React from "react";
import { db, auth } from "../../Firebase/FirebaseConnection";
import { collection, addDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

export function Addform(){

const navigation = useNavigation();
    const [anotacao, setAnotacao] = useState(''); // Estado para armazenar a anotação digitada pelo usuário

    const enviarAnotacaoFirestore = async () => {
        try {
            // Verifique se o usuário está autenticado
            const user = auth.currentUser; // Obtenha o usuário autenticado
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            const userID = user.uid; // Obtenha o UID do usuário autenticado

            // Adiciona a anotação como um novo documento na coleção "anotacoes" dentro do documento do usuário
            const userDocRef = doc(db, 'usuarios', userID);
            const anotacoesCollectionRef = collection(userDocRef, 'anotacoes');
            
            // Adiciona a anotação ao Firestore
            const docRef = await addDoc(anotacoesCollectionRef, {
                anotacao: anotacao, // Conteúdo da anotação
            });
            
            console.log('Anotação enviada com ID:', docRef.id);
            console.log('Anotação:', anotacao); // Exibe a anotação no console

            console.log('Anotação enviada com sucesso!');
            Alert.alert('Salvo!');
        } catch (error) {
            console.error('Erro ao enviar anotação:', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                placeholder="Querido Diário..."
                value={anotacao}
                onChangeText={setAnotacao} // Atualiza o estado anotacao com o texto digitado pelo usuário
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    height: '80%',
                    textAlignVertical: 'top', // Alinha o texto na parte superior
                }}
                multiline={true}
            />
            <TouchableOpacity style={styles.button} onPress={enviarAnotacaoFirestore}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#4CAF50',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  
