import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, FlatList, Modal, ActivityIndicator } from 'react-native';
import { auth, db } from '../../../Firebase/FirebaseConnection'; // Ajuste o caminho conforme necessário
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

export default function Pacientes() {
  const [emailPaciente, setEmailPaciente] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carregamento

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

  const fetchPacienteUIDByEmail = async (email) => {
    try {
      const usuariosCollectionRef = collection(db, 'usuarios');
      const querySnapshot = await getDocs(usuariosCollectionRef);

      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data();
        if (userData.email === email) {
          return docSnapshot.id;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar UID do paciente pelo email:', error.message);
      Alert.alert('Erro ao buscar UID do paciente pelo email:', error.message);
    }
  };

  const handleAddPaciente = async () => {
    if (emailPaciente.trim() === '') {
      Alert.alert('Por favor, insira o email do paciente.');
      return;
    }

    setLoading(true); // Inicia o carregamento

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Usuário não autenticado.');
        return;
      }

      const userID = user.uid;
      const psicologoDocRef = doc(db, 'psicologos', userID);

      // Busca os dados do psicólogo
      const psicologoDoc = await getDoc(psicologoDocRef);
      if (!psicologoDoc.exists()) {
        Alert.alert('Dados do psicólogo não encontrados.');
        return;
      }

      const psicologoData = psicologoDoc.data();
      const { nome, email: psicologoEmail } = psicologoData;

      // Busca o UID do paciente pelo email
      const pacienteUID = await fetchPacienteUIDByEmail(emailPaciente);
      if (!pacienteUID) {
        Alert.alert('Paciente não encontrado.');
        return;
      }

      const pacienteDocRef = doc(db, 'usuarios', pacienteUID);

      // Busca os dados do paciente existente
      const pacienteDoc = await getDoc(pacienteDocRef);
      if (!pacienteDoc.exists()) {
        Alert.alert('Paciente não encontrado.');
        return;
      }

      const pacienteData = pacienteDoc.data();

      // Cria um subdocumento chamado 'pacientes' dentro da coleção do psicólogo
      const psicologoPacienteDocRef = doc(db, `psicologos/${userID}/pacientes`, pacienteUID);
      await setDoc(psicologoPacienteDocRef, pacienteData);

      // Cria um subdocumento chamado 'psicologo' dentro do documento do paciente
      const psicologoSubDocRef = doc(pacienteDocRef, 'psicologo', userID);
      await setDoc(psicologoSubDocRef, {
        nome: nome,
        email: psicologoEmail,
      });

      Alert.alert('Paciente adicionado com sucesso!');
      setEmailPaciente('');
      fetchPacientes(); // Atualiza a lista de pacientes
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error.message);
      Alert.alert('Erro ao adicionar paciente:', error.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
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
        placeholder="Email do Paciente"
        value={emailPaciente}
        onChangeText={setEmailPaciente}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddPaciente}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Adicionar</Text>
        )}
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
    backgroundColor: "white",
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
    borderBottomWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 30,
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
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
