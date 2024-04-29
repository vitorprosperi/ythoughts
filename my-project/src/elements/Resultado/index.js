import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

export default function Result() {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
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
                    } else {
                        console.log("Documento do usuário não encontrado.");
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar informações do usuário:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            {userData && (
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <Text style={styles.paragraph}>
                        Prezado {userData.nome},
                    </Text>
                    <Text style={styles.paragraph}>
                        Após uma análise cuidadosa de suas respostas, gostaríamos de destacar a importância de buscar apoio profissional em saúde mental.
                    </Text>
                    <Text style={styles.paragraph}>
                        Profissionais de saúde mental estão preparados para oferecer apoio personalizado, estratégias eficazes de enfrentamento e orientação especializada para lidar com seus desafios. Eles fornecem um ambiente seguro e confidencial para discutir abertamente seus pensamentos, sentimentos e preocupações.
                    </Text>
                    <Text style={styles.paragraph}>
                        É essencial lembrar que os resultados deste questionário são apenas uma parte de uma avaliação mais ampla e não substituem a consulta individualizada com um profissional qualificado.
                    </Text>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollViewContainer: {
        flexGrow: 1,
        padding: 20,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: "justify",
        marginBottom: 10,
    },
});
