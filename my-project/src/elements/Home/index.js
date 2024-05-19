import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
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

  const handleActionSheetSelect = async (index) => {
    if (index === 0) {
      await handleShare(selectedAnotacaoId);
    } else if (index === 1) {
      handleDelete(selectedAnotacaoId);
    }
    setSelectedAnotacaoId(null);
    setActionSheetVisible(false);
  };

  const handleShare = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }

      const userID = user.uid;
      const userDocRef = doc(db, 'usuarios', userID);
      const anotacaoDocRef = doc(userDocRef, 'anotacoes', id);
      const anotacaoSnapshot = await getDoc(anotacaoDocRef);

      if (anotacaoSnapshot.exists()) {
        const anotacaoData = anotacaoSnapshot.data();

        // Recuperar a lista de psicólogos do paciente
        const pacienteDocRef = doc(db, 'usuarios', userID);
        const pacienteDocSnapshot = await getDoc(pacienteDocRef);

        if (pacienteDocSnapshot.exists()) {
          const pacienteData = pacienteDocSnapshot.data();
          const psicologos = pacienteData.psicologos;

          if (psicologos && psicologos.length > 0) {
            // Para simplicidade, vamos compartilhar com o primeiro psicólogo da lista
            const psicologoId = psicologos[0];
            const psicologoDocRef = doc(db, 'psicologos', psicologoId);
            const anotacaoCompartilhadaDocRef = doc(psicologoDocRef, 'anotacoes', id);

            await setDoc(anotacaoCompartilhadaDocRef, anotacaoData);
            Alert.alert('Anotação compartilhada com sucesso!');
          } else {
            Alert.alert('Nenhum psicólogo associado encontrado.');
          }
        } else {
          Alert.alert('Erro ao recuperar dados do paciente.');
        }
      } else {
        Alert.alert('Anotação não encontrada.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar anotação:', error);
      Alert.alert('Erro ao compartilhar anotação:', error.message);
    }
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
                <Text style={styles.anotacaoText}>{anotacao.anotacao}</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
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
});
