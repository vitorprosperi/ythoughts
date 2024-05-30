import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, doc, getDocs, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import CustomActionSheet from '../../CustomActionSheet';

export default function Home() {
  const navigation = useNavigation();
  const [anotacoes, setAnotacoes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAnotacaoId, setSelectedAnotacaoId] = useState(null);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [psicologos, setPsicologos] = useState([]);
  const [psicologoSelectionVisible, setPsicologoSelectionVisible] = useState(false);

  useEffect(() => {
    fetchAnotacoes();
  }, []);

  const fetchAnotacoes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }

      const userID = user.uid;
      const userDocRef = doc(db, 'usuarios', userID);
      const anotacoesCollectionRef = collection(userDocRef, 'anotacoes');
      const querySnapshot = await getDocs(anotacoesCollectionRef);
      let fetchedAnotacoes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenar as anotações por data (do mais recente para o mais antigo)
      fetchedAnotacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

      setAnotacoes(fetchedAnotacoes);
    } catch (error) {
      console.error('Erro ao recuperar anotações:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnotacoes();
  };

  function abrirform() {
    navigation.navigate('Addform');
  }

  const handleOptionsPress = (id) => {
    setSelectedAnotacaoId(id);
    setActionSheetVisible(true);
  };

  const handleActionSheetSelect = (index) => {
    if (index === 0) {
      fetchPsicologos();
    } else if (index === 1) {
      handleDelete(selectedAnotacaoId);
    }
    setActionSheetVisible(false);
  };

  const fetchPsicologos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }

      const userID = user.uid;
      const userDocRef = doc(db, 'usuarios', userID);
      const psicologoSubDocRef = collection(userDocRef, 'psicologo');
      const psicologoSnapshot = await getDocs(psicologoSubDocRef);

      if (!psicologoSnapshot.empty) {
        const psicologosList = psicologoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPsicologos(psicologosList);
        setPsicologoSelectionVisible(true);
      } else {
        Alert.alert('Nenhum psicólogo associado encontrado.');
      }
    } catch (error) {
      console.error('Erro ao recuperar psicólogos:', error);
      Alert.alert('Erro ao recuperar psicólogos:', error.message);
    }
  };

  const handleShare = async (psicologo) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }
  
      const userID = user.uid;
      const userDocRef = doc(db, 'usuarios', userID);
      const anotacaoDocRef = doc(userDocRef, 'anotacoes', selectedAnotacaoId);
      const anotacaoSnapshot = await getDoc(anotacaoDocRef);
  
      if (anotacaoSnapshot.exists()) {
        const anotacaoData = anotacaoSnapshot.data();
        const pacienteDocRef = doc(db, 'psicologos', psicologo.id, 'pacientes', userID);
        const anotacoesCollectionRef = collection(pacienteDocRef, 'anotacoes');
        const anotacaoCompartilhadaDocRef = doc(anotacoesCollectionRef, selectedAnotacaoId);
  
        await setDoc(anotacaoCompartilhadaDocRef, anotacaoData);
        Alert.alert('Anotação compartilhada com sucesso!');
      } else {
        Alert.alert('Anotação não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar anotação:', error);
      Alert.alert('Erro ao compartilhar anotação:', error.message);
    }
    setPsicologoSelectionVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `usuarios/${auth.currentUser.uid}/anotacoes/${id}`));
      fetchAnotacoes();
      console.log('Anotação deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar anotação:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity onPress={abrirform}>
        <View style={styles.imageContainer}>
          <FontAwesome name="plus" size={30} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
      <View>
        {anotacoes.length === 0 ? (
          <Text style={styles.text}>Suas anotações serão exibidas aqui!</Text>
        ) : (
          <Text style={styles.text}>Suas anotações:</Text>
        )}
        {anotacoes.map(anotacao => (
          <View key={anotacao.id}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>{anotacao.data}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AcessarAnotacao', { anotacaoTexto: anotacao.anotacao, id: anotacao.id })}
            >
              <View style={styles.anotacaoContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.anotacaoText}>{anotacao.anotacao}</Text>
                  <Text style={styles.emocaoText}>{anotacao.emocao}</Text>
                </View>
                <TouchableOpacity onPress={() => handleOptionsPress(anotacao.id)}>
                  <Text style={styles.opcoesText}>...</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <CustomActionSheet
        visible={actionSheetVisible}
        options={['Compartilhar', 'Apagar', 'Cancelar']}
        onSelect={handleActionSheetSelect}
        onCancel={() => setActionSheetVisible(false)}
      />

      <Modal
        visible={psicologoSelectionVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPsicologoSelectionVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione um Psicólogo</Text>
            {psicologos.map(psicologo => (
              <TouchableOpacity
                key={psicologo.id}
                style={styles.psicologoItem}
                onPress={() => handleShare(psicologo)}
              >
                <Text style={styles.psicologoText}>{psicologo.nome}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPsicologoSelectionVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 50,
    fontSize: 20,
    textAlign: 'center',
  },
  anotacaoContainer: {
    backgroundColor: '#B8F0B5',
    padding: 10,
    marginVertical: 5,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcoesText: {
    fontSize: 20,
    marginRight: 10,
  },
  anotacaoText: {
    fontSize: 16,
  },
  emocaoText: {
    fontSize: 14,
    color: 'gray',
  },
  dataContainer: {
    marginRight: 10,
    marginLeft: 15,
  },
  dataText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    padding: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  psicologoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  psicologoText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
