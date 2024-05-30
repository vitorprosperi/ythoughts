import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Result() {
  const navigation = useNavigation();
  const [dica, setDica] = useState('');
  const [respostas, setRespostas] = useState(null);

  useEffect(() => {
    fetchDica();
    fetchRespostas();
  }, []);

  const fetchDica = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }

      const userID = user.uid;
      const dicaDocRef = doc(db, "usuarios", userID, "psicologo", "dica");
      const dicaDoc = await getDoc(dicaDocRef);

      if (dicaDoc.exists()) {
        setDica(dicaDoc.data().texto);
      } else {
        console.log("Nenhuma dica encontrada.");
        setDica("Nenhum texto disponível.");
      }
    } catch (error) {
      console.error("Erro ao buscar a dica:", error.message);
      Alert.alert("Erro ao buscar a dica:", error.message);
    }
  };

  const fetchRespostas = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }

      const userID = user.uid;
      const respostasDocRef = doc(db, "usuarios", userID, "questionario", "respostas");
      const respostasDoc = await getDoc(respostasDocRef);

      if (respostasDoc.exists()) {
        setRespostas(respostasDoc.data());
      } else {
        console.log("Nenhuma resposta encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar as respostas:", error.message);
      Alert.alert("Erro ao buscar as respostas:", error.message);
    }
  };

  const handleGenerateReport = async () => {
    if (!respostas) {
      Alert.alert("Erro", "Nenhuma resposta disponível para gerar o relatório.");
      return;
    }

    try {
      const reportText = formatRespostasToText(respostas);
      await saveReportToFile(reportText);
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error.message);
      Alert.alert("Erro ao gerar o relatório:", error.message);
    }
  };

  const formatRespostasToText = (data) => {
    let report = 'Relatório de Respostas do Questionário\n\n';
    for (const [key, value] of Object.entries(data)) {
      report += `${key}: ${value}\n`;
    }
    return report;
  };

  const saveReportToFile = async (text) => {
    const fileName = `${FileSystem.documentDirectory}relatorio.txt`;
    await FileSystem.writeAsStringAsync(fileName, text, { encoding: FileSystem.EncodingType.UTF8 });
    Alert.alert("Sucesso", "Relatório gerado com sucesso!");
    await Sharing.shareAsync(fileName);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.dicaText}>{dica}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Questionario')}>
          <Text style={styles.buttonText}>Refazer Questionário</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton} onPress={handleGenerateReport}>
          <Text style={styles.reportButtonText}>Gerar Relatório</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dicaText: {
    fontSize: 17,
    marginTop: 50,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: 'green',
    padding: 13,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',     
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
  },
  reportButton: {
    backgroundColor: 'blue',
    padding: 13,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,     
    marginBottom: 10,
  },
  reportButtonText: {
    color: "#fff",
    fontSize: 17,
  },
});
