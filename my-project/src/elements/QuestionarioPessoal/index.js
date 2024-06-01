import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { db } from "../../../Firebase/FirebaseConnection";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from "@react-navigation/native";

export function QuestionarioPessoal() {
    const [perguntas, setPerguntas] = useState({});
    const [respostas, setRespostas] = useState([]);
    const { user } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPerguntas = async () => {
            try {
                if (!user) {
                    console.error('Usuário não autenticado.');
                    return;
                }

                const uid = user.uid;
                const perguntasDocRef = doc(db, 'usuarios', uid, 'questionario', 'perguntas');
                const perguntasDoc = await getDoc(perguntasDocRef);

                if (perguntasDoc.exists()) {
                    const perguntasData = perguntasDoc.data();
                    console.log('Perguntas encontradas:', perguntasData);
                    setPerguntas(perguntasData.perguntas || {});
                    const initialRespostas = Object.keys(perguntasData.perguntas).map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    setRespostas(initialRespostas);
                } else {
                    console.log('Nenhuma pergunta encontrada.');
                    setPerguntas({});
                }
            } catch (error) {
                console.error('Erro ao buscar perguntas:', error);
            }
        };
        fetchPerguntas();
    }, [user]);

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
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            const userID = user.uid;
            const userDocRef = doc(db, 'usuarios', userID);
            const userDocSnapshot = await getDoc(userDocRef);

            if (!userDocSnapshot.exists()) {
                console.error('Documento do usuário não encontrado.');
                return;
            }

            const dadosDocRef = doc(userDocRef, 'respostas', 'dados');

            const total = respostas.reduce((acc, resposta) => {
                return acc + resposta.reduce((acc, opcao) => acc + opcao, 0);
            }, 0);
            await setDoc(dadosDocRef, { total: total }, { merge: true });

            const respostasCollectionRef = doc(userDocRef, 'respostas', 'dados');

            const respostasData = respostas.map((resposta, index) => ({
                resposta: resposta,
            }));
            await setDoc(respostasCollectionRef, { respostas: respostasData }, { merge: true });

            console.log('Respostas atualizadas com sucesso!');
            navigation.navigate('Home', { userId: user.uid });
        } catch (error) {
            console.error('Erro ao enviar ou atualizar respostas:', error);
        }
    };

    const handleEnviarRespostas = () => {
        enviarRespostasFirestore();
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text>Por Favor, responda o questionário </Text>
                {Object.keys(perguntas).map((key, perguntaIndex) => (
                    <View key={perguntaIndex}>
                        <Text>{perguntaIndex + 1}: {perguntas[key]}</Text>
                        <View style={styles.botaoContainer}>
                            {[...Array(5)].map((_, numero) => (
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
                    </View>
                ))}
                <TouchableOpacity style={styles.buttonEnviar} onPress={handleEnviarRespostas}>
                    <Text style={styles.buttonText}>Enviar Respostas</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
    },
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
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 20,
        width: '18%',
        alignItems: 'center',
    },
    botaoPressionado: {
        backgroundColor: 'red',
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonEnviar: {
        backgroundColor: 'green',
        padding: 13,
        borderRadius: 30,
        marginTop: 14,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
