import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from "../../../Firebase/FirebaseConnection";
import { collection, getDocs } from "firebase/firestore";

export function Questionario() {
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState([]);

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
        const updatedRespostas = [...respostas];
        updatedRespostas[perguntaIndex][opcaoIndex] = resposta;
        setRespostas(updatedRespostas);
    };

    const enviarRespostas = () => {
        console.log('Respostas enviadas:', respostas);
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
                                    respostas[perguntaIndex][0] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 0, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 1}: {pergunta.perg2}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex][1] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 1, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 1}: {pergunta.perg3}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex][2] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 2, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
            <TouchableOpacity style={styles.buttonEnviar} onPress={enviarRespostas}>
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
