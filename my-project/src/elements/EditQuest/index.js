import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { db } from "../../../Firebase/FirebaseConnection";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function EditQuest() {
    const route = useRoute();
    const { pacienteId } = route.params; // Recebe o ID do paciente como parâmetro da navegação
    const [perguntas, setPerguntas] = useState({});
    const [loading, setLoading] = useState(true); // Estado de carregamento

    useEffect(() => {
        fetchPerguntas();
    }, []);

    const fetchPerguntas = async () => {
        try {
            console.log("Buscando perguntas no Firestore...");
            const perguntasDocRef = doc(db, 'usuarios', pacienteId, 'questionario', 'perguntas');
            const perguntasDoc = await getDoc(perguntasDocRef);

            if (perguntasDoc.exists()) {
                const perguntasData = perguntasDoc.data();
                console.log("Perguntas encontradas no subdocumento do usuário:", perguntasData);
                setPerguntas(perguntasData.perguntas || {});
            } else {
                console.log("Subdocumento 'perguntas' não encontrado. Buscando perguntas padrão...");
                const perguntasPadraoRef = doc(db, 'perguntas', 'FOdNtzwfAa7haRkKwK5D');
                const perguntasPadraoDoc = await getDoc(perguntasPadraoRef);

                if (perguntasPadraoDoc.exists()) {
                    const perguntasPadraoData = perguntasPadraoDoc.data();
                    console.log("Perguntas encontradas no documento padrão:", perguntasPadraoData);

                    // Agora ajustamos para usar diretamente as perguntas
                    setPerguntas(perguntasPadraoData || {});
                    console.log("Perguntas padrão definidas no estado:", perguntasPadraoData);
                } else {
                    console.log("Nenhuma pergunta encontrada no documento padrão.");
                    setPerguntas({});
                }
            }
        } catch (error) {
            console.error("Erro ao buscar perguntas:", error.message);
            Alert.alert("Erro ao buscar perguntas:", error.message);
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };

    const handlePerguntaChange = (key, text) => {
        setPerguntas(prevState => ({
            ...prevState,
            [key]: text,
        }));
    };

    const handleSave = async () => {
        try {
            console.log("Salvando perguntas no Firestore...", perguntas);
            const perguntasDocRef = doc(db, 'usuarios', pacienteId, 'questionario', 'perguntas');
            
            const perguntasDoc = await getDoc(perguntasDocRef);
    
            if (perguntasDoc.exists()) {
                // Se o subdocumento já existe, atualiza-o
                await updateDoc(perguntasDocRef, { perguntas });
                console.log("Perguntas atualizadas com sucesso!");
            } else {
                // Se o subdocumento não existe, cria-o
                await setDoc(perguntasDocRef, { perguntas });
                console.log("Perguntas salvas com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao salvar perguntas:", error.message);
            Alert.alert("Erro ao salvar perguntas:", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Editar Perguntas</Text>
                {loading ? (
                    <Text>Carregando perguntas...</Text>
                ) : (
                    Object.keys(perguntas).length > 0 ? (
                        Object.keys(perguntas)
                            .sort((a, b) => {
                                const numA = parseInt(a.match(/\d+/)[0]);
                                const numB = parseInt(b.match(/\d+/)[0]);
                                return numA - numB;
                            })
                            .map((key, index) => (
                                <View key={index} style={styles.inputContainer}>
                                    <Text style={styles.label}>{key}:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={String(perguntas[key])} // Converte o valor para string
                                        onChangeText={text => handlePerguntaChange(key, text)}
                                    />
                                </View>
                            ))
                    ) : (
                        <Text>Nenhuma pergunta encontrada.</Text>
                    )
                )}
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Salvar</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
