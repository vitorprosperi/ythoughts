import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

export default function Result() {
    const [userData, setUserData] = useState(null);
    const [total, setTotal] = useState(null); // Adicionando estado para o total
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar o RefreshControl
    const navigation = useNavigation();

    // Função para buscar os dados do usuário
    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userID = user.uid;
                const userDocRef = doc(db, 'usuarios', userID);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserData(userData);

                    const dadosDocRef = doc(userDocRef, 'respostas', 'dados');
                    const dadosDocSnapshot = await getDoc(dadosDocRef);
                    if (dadosDocSnapshot.exists()) {
                        const total = dadosDocSnapshot.data().total;
                        setTotal(total); // Atualiza o estado do total
                    }
                } else {
                    console.log("Documento do usuário não encontrado.");
                }
            }
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
        }
    };

    useEffect(() => {
        fetchUserData(); // Chama a função fetchUserData dentro do useEffect
    }, []);

    // Função para lidar com o refresh
    const onRefresh = () => {
        console.log("Refresh iniciado");
        setRefreshing(true); // Indica que o refresh está em progresso

        // Simula um tempo de espera para demonstrar o efeito visual do refresh
        setTimeout(() => {
            // Aqui você pode chamar a função de busca de dados novamente
            fetchUserData();
            setRefreshing(false); // Indica que o refresh foi concluído
            console.log("Refresh concluído");
        }, 2000); // 2000ms = 2 segundos, você pode ajustar conforme necessário
    };

    // Verifica se a soma é menor que 25
    if (total !== null && total < 25) {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContainer}
                    refreshControl={ // Adiciona o RefreshControl ao ScrollView
                        <RefreshControl
                            refreshing={refreshing} // Define se o refresh está em progresso
                            onRefresh={onRefresh} // Função para lidar com o refresh
                        />
                    }
                >
                    <Text style={styles.paragraph}>
                        Estamos muito felizes em saber que você está bem!
                    </Text>
                    <Text style={styles.paragraph}>
                        É importante manter o cuidado constante com sua saúde física e psicológica. Seu bem-estar é uma prioridade e, para isso, é fundamental estar atento não apenas ao corpo, mas também à mente.
                    </Text>
                    <Text style={styles.paragraph}>
                        Lembramos que, assim como cuidamos da nossa saúde física com exercícios e alimentação adequada, também é essencial cuidar da saúde mental. Profissionais especializados em saúde mental estão disponíveis para oferecer apoio personalizado e estratégias eficazes para lidar com quaisquer desafios que possam surgir. Eles proporcionam um ambiente acolhedor e confidencial para que você possa expressar seus pensamentos, sentimentos e preocupações sem julgamentos.
                    </Text>
                </ScrollView>
            </View>
        );
    } else {
        // Caso contrário, retorna a mensagem padrão
        return (
            <View style={styles.container}>
                {userData && (
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContainer}
                        refreshControl={ // Adiciona o RefreshControl ao ScrollView
                            <RefreshControl
                                refreshing={refreshing} // Define se o refresh está em progresso
                                onRefresh={onRefresh} // Função para lidar com o refresh
                            />
                        }
                    >
                        <Text style={styles.paragraphstart}>
                            Prezado (a) {userData.nome},
                        </Text>
                        <Text style={styles.paragraph}>
                            Após uma análise cuidadosa de suas respostas, gostaríamos de destacar a importância de buscar apoio profissional em saúde mental.
                        </Text>
                        <Text style={styles.paragraph}>
                            Profissionais de saúde mental estão preparados para oferecer apoio personalizado, estratégias eficazes de enfrentamento e orientação especializada para lidar com seus desafios. Eles fornecem um ambiente seguro e confidencial para discutir abertamente seus pensamentos, sentimentos e preocupações.
                        </Text>
                        <Text style={styles.paragraph}>
                            É essencial lembrar que os resultados deste questionário são apenas uma parte de uma avaliação mais ampla e não devem ser levado como um diagnóstico, questionários assim não substituem a consulta individualizada com um profissional qualificado.
                        </Text>
                    </ScrollView>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContainer: {
        flexGrow: 1,
        padding: 20,
    },
    paragraphstart: {
        marginTop: 70,
        fontSize: 16,
        lineHeight: 24,
        textAlign: "justify",
        marginBottom: 10,
    },
    paragraph: {
        marginTop: 20,
        fontSize: 16,
        lineHeight: 24,
        textAlign: "justify",
        marginBottom: 10,
    },
});