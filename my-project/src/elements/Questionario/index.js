import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { db } from "../../../Firebase/FirebaseConnection";
import { collection, getDocs } from "firebase/firestore";

export function Questionario() {
    const [perguntas, setPerguntas] = useState([]);

    useEffect(() => {
        const fetchPerguntas = async () => {
            try {
                const perguntasSnapshot = await getDocs(collection(db, 'perguntas'));
                const perguntasData = perguntasSnapshot.docs.map(doc => doc.data());
                setPerguntas(perguntasData);
            } catch (error) {
                console.error('Erro ao buscar perguntas:', error);
            }
        };
        fetchPerguntas();
    }, []);

    const handleRespostaChange = (perguntaIndex, opcaoIndex, resposta) => {
        // Aqui você pode adicionar lógica para lidar com a mudança de resposta
        console.log(`Pergunta ${perguntaIndex + 1}, Opção ${opcaoIndex + 1}, Resposta ${resposta}`);
    };

    return (
        <View style={styles.container}>
            <Text>Antes de Começarmos, Algumas Perguntas Serão Feitas!</Text>
            {perguntas.map((pergunta, index) => (
                <View key={index}>
                    <Text>{index + 1}: {pergunta.perg1}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={styles.botao}
                                onPress={() => handleRespostaChange(index, 0, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{index + 2}: {pergunta.perg2}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={styles.botao}
                                onPress={() => handleRespostaChange(index, 1, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{index + 3}: {pergunta.perg3}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(10)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={styles.botao}
                                onPress={() => handleRespostaChange(index, 2, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
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
