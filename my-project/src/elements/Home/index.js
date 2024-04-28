import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
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
      const fetchedAnotacoes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      fetchedAnotacoes.reverse();

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
      handleDelete(selectedAnotacaoId);
    }
    setSelectedAnotacaoId(null);
    setActionSheetVisible(false);
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
        options={['Apagar', 'Cancelar']}
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
    margin: 20,
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
