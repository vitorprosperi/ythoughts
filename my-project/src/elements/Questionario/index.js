import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from "../../../Firebase/FirebaseConnection";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";


export function Questionario() {
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState([]);
    const route = useRoute();
    const {userID} = route.params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const perguntasSnapshot = await getDocs(collection(db, 'perguntas'));
                const perguntasData = perguntasSnapshot.docs.map(doc => doc.data());
                setPerguntas(perguntasData);
                const initialRespostas = perguntasData.map(() => [0, 0, 0]); // Inicializa as respostas de cada pergunta como [0, 0, 0]
                setRespostas(initialRespostas);
            } catch (error) {
                console.error('Erro ao buscar perguntas:', error);
            }
        };
        fetchData();
    }, []);

    const handleRespostaChange = (perguntaIndex, opcaoIndex, resposta) => {
        if (respostas.length === 0) {
            return;
        }
        const updatedRespostas = [...respostas];
        updatedRespostas[perguntaIndex][opcaoIndex] = resposta;
        setRespostas(updatedRespostas);
    };

    const enviarRespostasFirestore = async () => {
        try {
            // Verifique se o usuário está autenticado
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            const userID = user.uid; // Obtenha o UID do usuário autenticado

            // Itera sobre as respostas
            respostas.forEach(async (resposta, index) => {
                // Adiciona a resposta como um novo documento na coleção "respostas" com o UID do usuário
                const docRef = await addDoc(collection(db, 'respostas'), {
                    userID: userID, // Adicione o UID do usuário 
                    resposta: resposta, // Array com as opções selecionadas para essa pergunta
                });
                console.log('Resposta enviada com ID:', docRef.id);
            });
            console.log('Todas as respostas foram enviadas com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar respostas:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Antes de Começarmos, Algumas Perguntas Serão Feitas!</Text>
            {perguntas.map((pergunta, perguntaIndex) => (
                <View key={perguntaIndex}>
                    <Text>{perguntaIndex + 1}: {pergunta.perg1}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][0] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 0, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 2}: {pergunta.perg2}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][1] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 1, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 3}: {pergunta.perg3}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][2] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 2, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
            <TouchableOpacity style={styles.buttonEnviar} onPress={enviarRespostasFirestore}>
                <Text style={styles.buttonText}>Enviar Respostas</Text>
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
    botaoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    botao: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        width: '10%',
        alignItems: 'center',
    },
    botaoPressionado: {
        backgroundColor: '#2980b9',
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonEnviar: {
        backgroundColor: '#2ecc71',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
