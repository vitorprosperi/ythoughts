import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export default function DicasPsic() {
  const navigation = useNavigation();
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }

      const userID = user.uid;
      const pacientesCollectionRef = collection(db, "psicologos", userID, "pacientes");
      const querySnapshot = await getDocs(pacientesCollectionRef);

      const pacientesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPacientes(pacientesList);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error.message);
      Alert.alert("Erro ao buscar pacientes:", error.message);
    }
  };

  const handlePacientePress = (pacienteId) => {
    setSelectedPacienteId(pacienteId);
  };

  const handleSendPress = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado.");
        return;
      }

      const userID = user.uid;
      const dicaData = {
        pacienteId: selectedPacienteId,
        texto: inputText,
        timestamp: new Date(),
      };

      // Adiciona ou atualiza a dica no subdocumento "dica" do usuário do paciente
      const pacientePsicologoDocRef = doc(db, "usuarios", selectedPacienteId, "psicologo", "dica");
      await setDoc(pacientePsicologoDocRef, dicaData, { merge: true });

      Alert.alert("Sucesso", "Dica enviada com sucesso!");
      setInputText('');
      setSelectedPacienteId(null);
    } catch (error) {
      console.error("Erro ao enviar dica:", error.message);
      Alert.alert("Erro ao enviar dica:", error.message);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPacientes();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {pacientes.map(paciente => (
          <View key={paciente.id} style={styles.pacienteContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePacientePress(paciente.id)}
            >
              <Text style={styles.buttonText}>{paciente.nome}</Text>
            </TouchableOpacity>
            {selectedPacienteId === paciente.id && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Digite sua mensagem"
                  value={inputText}
                  onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
                  <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
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
    alignItems: "center",
    padding: 20,
  },
  pacienteContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'green',
    padding: 13,
    borderRadius: 30,
    marginTop: 14,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
},
buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  sendButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
