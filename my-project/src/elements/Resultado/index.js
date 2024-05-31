import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { doc, getDoc } from "firebase/firestore";

export default function Result() {
  const navigation = useNavigation();
  const [dica, setDica] = useState('');

  useEffect(() => {
    fetchDica();
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.dicaText}>{dica}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Questionario')}>
          <Text style={styles.buttonText}>Refazer Questionário</Text>
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
});