import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, getDocs } from 'firebase/firestore';

export default function HomePsic() {
  const navigation = useNavigation();
  const [pacientes, setPacientes] = useState([]);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Usuário não autenticado.');
        return;
      }

      const userID = user.uid;
      const pacientesCollectionRef = collection(db, `psicologos/${userID}/pacientes`);
      const querySnapshot = await getDocs(pacientesCollectionRef);

      const pacientesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPacientes(pacientesList);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error.message);
      Alert.alert('Erro ao buscar pacientes:', error.message);
    }
  };

  const handlePacientePress = (paciente) => {
    // Navegue para a tela do paciente com base no id do paciente
    navigation.navigate('AnotaçõesPaciente', { pacienteId: paciente.id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pacientes</Text>
      {pacientes.map(paciente => (
        <TouchableOpacity key={paciente.id} onPress={() => handlePacientePress(paciente)}>
          <View style={styles.pacienteItem}>
            <Text style={styles.pacienteText}>{paciente.nome}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pacienteItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  pacienteText: {
    fontSize: 18,
  },
});
