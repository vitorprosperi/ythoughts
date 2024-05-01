import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { db } from "../../../Firebase/FirebaseConnection";
import { doc, collection, getDocs, addDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from "@react-navigation/native";

export function Questionario() {
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState([]);
    const route = useRoute();
    const uid = user ? user.uid : null;
    const { user } = useAuth();
    const navigation = useNavigation();
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const perguntasSnapshot = await getDocs(collection(db, 'perguntas'));
                const perguntasData = perguntasSnapshot.docs.map(doc => doc.data());
                setPerguntas(perguntasData);
                const initialRespostas = perguntasData.map(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Inicializa as respostas de cada pergunta como [0]
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
    
            // Verifica se o usuário já possui um documento no Firestore
            const userDocRef = doc(db, 'usuarios', userID);
            const userDocSnapshot = await getDoc(userDocRef);
    
            if (!userDocSnapshot.exists()) {
                console.error('Documento do usuário não encontrado.');
                return;
            }
    
            // Referência ao subdocumento 'dados' dentro do documento 'respostas' do usuário
            const dadosDocRef = doc(userDocRef, 'respostas', 'dados');
    
            // Atualiza o campo "total" dentro do subdocumento 'dados'
            const total = respostas.reduce((acc, resposta) => {
                return acc + resposta.reduce((acc, opcao) => acc + opcao, 0);
            }, 0);
            await setDoc(dadosDocRef, { total: total }, { merge: true });
    
            // Referência à coleção 'respostas' dentro do documento do usuário
            const respostasCollectionRef = collection(userDocRef, 'respostas');
    
            // Atualiza as respostas na coleção 'respostas' do usuário
            const respostasData = respostas.map((resposta, index) => ({
                perguntaIndex: index, // Adicione o índice da pergunta para referência
                resposta: resposta, // Array com as opções selecionadas para essa pergunta
            }));
            await setDoc(doc(respostasCollectionRef, 'dados'), { respostas: respostasData }, { merge: true });
    
            console.log('Respostas atualizadas com sucesso!');
            navigation.navigate('Home', { userId: user.uid });
        } catch (error) {
            console.error('Erro ao enviar ou atualizar respostas:', error);
        }
    };
    

    const handleEnviarRespostas = () => {
        enviarRespostasFirestore(); // Chame a função enviarRespostasFirestore aqui
    };

    return (
        <ScrollView>
        <View style={styles.container}>
            <Text>Por Favor, responda o questionário </Text>
            {perguntas.map((pergunta, perguntaIndex) => (
                <View key={perguntaIndex}>
                    <Text>{perguntaIndex + 1}: {pergunta.perg1}</Text>
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
                    <Text>{perguntaIndex + 2}: {pergunta.perg2}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
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
                        {[...Array(5)].map((_, numero) => (
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
                    <Text>{perguntaIndex + 4}: {pergunta.perg4}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][3] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 3, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 5}: {pergunta.perg5}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][4] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 4, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 6}: {pergunta.perg6}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][5] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 5, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 7}: {pergunta.perg7}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][6] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 6, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 8}: {pergunta.perg8}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][7] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 7, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 9}: {pergunta.perg9}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][8] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 8, numero + 1)}>
                                <Text style={styles.botaoTexto}>{numero + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text>{perguntaIndex + 10}: {pergunta.perg10}</Text>
                    <View style={styles.botaoContainer}>
                        {[...Array(5)].map((_, numero) => (
                            <TouchableOpacity
                                key={numero}
                                style={[
                                    styles.botao,
                                    respostas[perguntaIndex] && respostas[perguntaIndex][9] === numero + 1 ? styles.botaoPressionado : null
                                ]}
                                onPress={() => handleRespostaChange(perguntaIndex, 9, numero + 1)}>
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
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        width: '18%', // Alterado para 18% para acomodar 5 botões na mesma linha
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
