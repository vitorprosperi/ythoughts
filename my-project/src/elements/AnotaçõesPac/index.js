import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, getDocs } from 'firebase/firestore';

export default function AnotacoesPaciente() {
  const [anotacoes, setAnotacoes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }
  
      const userID = user.uid;
      const pacientesCollectionRef = collection(db, 'psicologos', userID, 'pacientes');
      const querySnapshot = await getDocs(pacientesCollectionRef);
  
      const pacientesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log("Pacientes:", pacientesList);
      setPacientes(pacientesList);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error.message);
      Alert.alert('Erro ao buscar pacientes:', error.message);
    }
  };

  useEffect(() => {
    if (pacienteSelecionado) {
      fetchAnotacoesDoPaciente();
    }
  }, [pacienteSelecionado]);

  const fetchAnotacoesDoPaciente = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }
  
      const userID = user.uid;
      const anotacoesCollectionRef = collection(db, 'psicologos', userID, 'pacientes', pacienteSelecionado.id, 'anotacoes');
      const querySnapshot = await getDocs(anotacoesCollectionRef);
  
      const anotacoesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log("Anotações:", anotacoesList);
      setAnotacoes(anotacoesList);
    } catch (error) {
      console.error('Erro ao buscar anotações do paciente:', error.message);
      Alert.alert('Erro ao buscar anotações do paciente:', error.message);
    }
  };

  const handlePacientePress = (paciente) => {
    console.log('Paciente selecionado:', paciente);
    setPacienteSelecionado(paciente);
    setAnotacoes([]);  // Limpa as anotações anteriores quando um novo paciente é selecionado
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Renderizar a lista de pacientes como TouchableOpacity */}
        {pacientes.map(paciente => (
          <TouchableOpacity key={paciente.id} style={styles.pacienteItem} onPress={() => handlePacientePress(paciente)}>
            <Text style={styles.pacienteText}>{paciente.nome}</Text>
          </TouchableOpacity>
        ))}

        {/* Renderizar as anotações do paciente selecionado */}
        {pacienteSelecionado && (
          <View style={styles.anotacoesContainer}>
            <Text style={styles.anotacoesTitle}>Anotações de {pacienteSelecionado.nome}:</Text>
            {anotacoes.length > 0 ? (
              anotacoes.map(anotacao => (
                <View key={anotacao.id} style={styles.anotacaoItem}>
                  <Text>{anotacao.anotacao}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAnotacoesText}>Nenhuma anotação encontrada.</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  pacienteItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  pacienteText: {
    fontSize: 18,
  },
  anotacoesContainer: {
    marginTop: 20,
  },
  anotacoesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  anotacaoItem: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 10,
  },
  noAnotacoesText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
