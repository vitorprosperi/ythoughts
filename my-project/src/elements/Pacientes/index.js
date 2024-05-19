import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, Modal } from 'react-native';
import { auth, db } from '../../../Firebase/FirebaseConnection'; // Ajuste o caminho conforme necessário
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import CustomActionSheet from '../../CustomActionSheet';

export default function Pacientes() {
  const [codigoPaciente, setCodigoPaciente] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleAddPaciente = async () => {
    if (codigoPaciente.trim() === '') {
      Alert.alert('Por favor, insira o código do paciente.');
      return;
    }
    
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Usuário não autenticado.');
        return;
      }
    
      const userID = user.uid;
      const pacienteDocRef = doc(db, 'usuarios', codigoPaciente);
    
      // Cria um documento para o paciente
      const pacienteData = {
        // Adicione aqui os dados relevantes do paciente
      };
    
      await setDoc(pacienteDocRef, pacienteData);
    
      // Cria um subdocumento chamado 'psicologo' dentro do documento do paciente
      const psicologoData = {
        nome: user.displayName,
        email: user.email,
        // Outros dados relevantes do psicólogo
      };
    
      await setDoc(doc(pacienteDocRef, 'psicologo', userID), psicologoData);
    
      // Adiciona o paciente à lista de pacientes do psicólogo
      const psicologoDocRef = doc(db, 'psicologos', userID);
      await setDoc(doc(psicologoDocRef, 'pacientes', codigoPaciente), pacienteData);
    
      Alert.alert('Paciente adicionado com sucesso!');
      setCodigoPaciente('');
      fetchPacientes(); // Atualiza a lista de pacientes
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error.message);
      Alert.alert('Erro ao adicionar paciente:', error.message);
    }
  };

  const handlePacientePress = (paciente) => {
    setSelectedPaciente(paciente);
    setModalVisible(true);
  };

  const handleDeletePaciente = async (pacienteId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Usuário não autenticado.');
        return;
      }

      const userID = user.uid;
      const psicologoDocRef = doc(db, 'psicologos', userID);
      await deleteDoc(doc(psicologoDocRef, 'pacientes', pacienteId));
      Alert.alert('Paciente excluído com sucesso!');
      fetchPacientes(); // Atualiza a lista de pacientes após exclusão
    } catch (error) {
      console.error('Erro ao excluir paciente:', error.message);
      Alert.alert('Erro ao excluir paciente:', error.message);
    }
  };

  const renderPacienteItem = ({ item }) => (
    <View style={styles.pacienteItem}>
      <TouchableOpacity style={styles.pacienteTouchable} onPress={() => handlePacientePress(item)}>
        <Text style={styles.pacienteText}>{item.nome}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeletePaciente(item.id)}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adicionar Paciente</Text>
      <TextInput
        style={styles.input}
        placeholder="Código do Paciente"
        value={codigoPaciente}
        onChangeText={setCodigoPaciente}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddPaciente}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Pacientes Cadastrados</Text>
      <FlatList
        data={pacientes}
        renderItem={renderPacienteItem}
        keyExtractor={item => item.id}
      />

<Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      {selectedPaciente && (
        <>
          <Text style={styles.modalTitle}>Detalhes do Paciente</Text>
          <Text style={styles.modalText}>Nome: {selectedPaciente.nome}</Text>
          <Text style={styles.modalText}>Email: {selectedPaciente.email}</Text>
          <Text style={styles.modalText}>Idade: {selectedPaciente.idade}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePaciente(selectedPaciente.id)}
          >
            <Text style={styles.buttonText}>Excluir Paciente</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pacienteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  pacienteTouchable: {
    flex: 1,
  },
  pacienteText: {
    fontSize: 18,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red', // Altere a cor conforme necessário
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
},
});
