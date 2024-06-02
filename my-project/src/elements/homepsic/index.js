import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,
   TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function AnotacoesPaciente() {
  const navigation = useNavigation();
  const [anotacoes, setAnotacoes] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPacientes();
    if (pacienteSelecionado) {
      await fetchAnotacoesDoPaciente();
    }
    setRefreshing(false);
  };

  const handleEditQuestPress = (paciente) => {
    navigation.navigate('EditQuest', { pacienteId: paciente.id });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.texto}>Lista de Pacientes:</Text>
        {/* Renderizar a lista de pacientes como TouchableOpacity */}
        {pacientes.map(paciente => (
          <TouchableOpacity key={paciente.id} style={styles.pacienteItem} onPress={() => handlePacientePress(paciente)}>
            <Text style={styles.pacienteText}>{paciente.nome}</Text>
            <TouchableOpacity style={styles.remake} onPress={() => handleEditQuestPress(paciente)}>
              <Text style={styles.remaketext}>Alterar Questionário</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Renderizar as anotações do paciente selecionado */}
        {pacienteSelecionado && (
          <ScrollView style={styles.anotacoesContainer}>
            <Text style={styles.anotacoesTitle}>Anotações de {pacienteSelecionado.nome}:</Text>
            {anotacoes.length > 0 ? (
              anotacoes.map(anotacao => (
                <View key={anotacao.id} style={styles.anotacaoItem}>
                  <Text style={styles.anotacaoTexto}>{anotacao.anotacao}</Text>
                  <Text style={styles.anotacaoData}>{anotacao.data}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAnotacoesText}>Nenhuma anotação encontrada.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  pacienteItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: 'green',
    borderRadius: 20,
  },
  remake: {
    padding: 15,
    backgroundColor: '#b2d8d8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 30,
    
  },
  remaketext:{
    color: 'white',
    fontWeight: 'bold',
  },
  pacienteText: {
    fontSize: 18,
  },
  texto:{
    fontSize: 23,
    fontWeight: 'bold'  
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
    borderRadius: 30,
  },
  anotacaoTexto: {
    fontSize: 16,
  },
  anotacaoData: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noAnotacoesText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
