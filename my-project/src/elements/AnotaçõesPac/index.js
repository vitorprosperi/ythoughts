import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, getDocs, doc } from 'firebase/firestore';

export default function AnotacoesPaciente() {
    const navigation = useNavigation();
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
        const pacienteDocRef = doc(db, 'psicologos', userID, 'pacientes', pacienteSelecionado.id);
        const anotacoesCollectionRef = collection(pacienteDocRef, 'anotacoes');
        const querySnapshot = await getDocs(anotacoesCollectionRef);
  
        const anotacoesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setAnotacoes(anotacoesList);
      } catch (error) {
        console.error('Erro ao buscar anotações do paciente:', error.message);
        Alert.alert('Erro ao buscar anotações do paciente:', error.message);
      }
    };
  
    const handlePacientePress = (paciente) => {
      setPacienteSelecionado(paciente);
    };
  
    return (
      <ScrollView>
        {/* Renderizar a lista de pacientes como TouchableOpacity */}
        {pacientes.map(paciente => (
          <TouchableOpacity key={paciente.id} onPress={() => handlePacientePress(paciente)}>
            <Text>{paciente.nome}</Text>
          </TouchableOpacity>
        ))}
  
        {/* Renderizar as anotações do paciente selecionado */}
        <View>
          {anotacoes.map(anotacao => (
            <View key={anotacao.id}>
              <Text>{anotacao.texto}</Text>
              {/* Outras informações da anotação, se necessário */}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
