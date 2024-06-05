import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { db } from "../../../Firebase/FirebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from "@react-navigation/native";

export function QuestionarioPessoal() {
  const route = useRoute();
  const { userId, questionarioId } = route.params;
  const { user } = useAuth();
  const navigation = useNavigation();
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState({});

  useEffect(() => {
    fetchPerguntas();
  }, []);

  const fetchPerguntas = async () => {
    try {
      if (!userId || !questionarioId) {
        console.error("userId ou questionarioId não fornecidos.");
        return;
      }

      const perguntasDocRef = doc(db, "usuarios", userId, "questionario", questionarioId);
      const perguntasDoc = await getDoc(perguntasDocRef);

      if (perguntasDoc.exists()) {
        const perguntasData = perguntasDoc.data().perguntas;
        const sortedPerguntas = Object.keys(perguntasData)
          .sort((a, b) => a.localeCompare(b))
          .map(key => perguntasData[key]);
        setPerguntas(sortedPerguntas);
      } else {
        console.log("Nenhuma pergunta encontrada.");
        Alert.alert("Erro", "Nenhuma pergunta encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar as perguntas:", error.message);
      Alert.alert("Erro ao buscar as perguntas:", error.message);
    }
  };

  const handleSelectAnswer = (perguntaIndex, answer) => {
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [perguntaIndex]: answer,
    }));
  };

  const handleSaveAnswers = async () => {
    try {
      if (!userId) {
        console.error("Usuário não autenticado.");
        return;
      }

      const total = Object.values(respostas).reduce((sum, val) => sum + val, 0);
      const respostasDocRef = doc(db, "usuarios", userId, "respostas", "dados");
      await setDoc(respostasDocRef, { ...respostas, total }, { merge: true });

      Alert.alert("Sucesso", "Respostas salvas com sucesso!");
      navigation.navigate('Home', { userId: user.uid });
    } catch (error) {
      console.error("Erro ao salvar as respostas:", error.message);
      Alert.alert("Erro ao salvar as respostas:", error.message);
    }
  };

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        {perguntas.length > 0 ? (
          perguntas.map((pergunta, index) => (
            <View key={index} style={styles.perguntaContainer}>
              <Text style={styles.perguntaText}>{index + 1}: {pergunta}</Text>
              <View style={styles.botaoContainer}>
                {[1, 2, 3, 4, 5].map((answer) => (
                  <TouchableOpacity
                    key={answer}
                    style={[
                      styles.botao,
                      respostas[index] === answer && styles.botaoPressionado,
                    ]}
                    onPress={() => handleSelectAnswer(index, answer)}
                  >
                    <Text style={styles.botaoTexto}>{answer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.perguntaText}>Nenhuma pergunta disponível.</Text>
        )}
        <TouchableOpacity style={styles.buttonEnviar} onPress={handleSaveAnswers}>
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
  perguntaContainer: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  perguntaText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center",
  },
  botaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  botao: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 20,
    width: '18%',
    alignItems: 'center',
    marginHorizontal: 5,
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
