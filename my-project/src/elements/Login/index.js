import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { auth, db } from "../../../Firebase/FirebaseConnection";
import { collection, getDocs } from "firebase/firestore";

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const checkRespostas = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userID = user.uid;
          const respostasCollectionRef = collection(db, 'usuarios', userID, 'respostas');
          const respostasSnapshot = await getDocs(respostasCollectionRef);
          console.log('Respostas:', respostasSnapshot.docs.length); // Adicionar um log para ver o número de documentos retornados
          if (!respostasSnapshot.empty) {
            // Se existem documentos na coleção de respostas, navegue para a tela "Home"
            navigation.navigate('Home');
          } else {
            // Se não há documentos na coleção de respostas, navegue para a tela "Questionario"
            navigation.navigate('Questionario');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar respostas:', error);
      }
    };

    checkRespostas();
  }, []);

  async function signIn() {
    if (!email || !password) {
      Alert.alert('Preencha Todos os Campos!');
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        console.log('Usuário logado com sucesso! UID:', user.uid);
        const userID = user.uid;
        const respostasCollectionRef = collection(db, 'usuarios', userID, 'respostas');
        const respostasSnapshot = await getDocs(respostasCollectionRef);
  
        if (!respostasSnapshot.empty) {
          // Se existem documentos na coleção de respostas, navegue para a tela "Home"
          navigation.navigate('Home');
        } else {
          // Se não há documentos na coleção de respostas, navegue para a tela "Questionario"
          navigation.navigate('Questionario', { userId: user.uid });
        }
      } else {
        console.error('O objeto user é nulo.');
      }
    } catch (error) {
      Alert.alert('E-mail ou Senha incorretos.');
      console.log('Erro ao fazer login:', error.message);
    }
  }

  function navigateCadastro() {
    navigation.navigate('Cadastro');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Bem-Vindo</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
           placeholder="Senha"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', // Ocupa a largura total da tela
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    paddingHorizontal: 20, // Adiciona um espaçamento lateral para os inputs
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 20, // Adiciona um espaçamento lateral para os inputs
    width: '100%', // Ocupa a largura total do container
    marginBottom: 10, // Adiciona um espaçamento inferior entre os inputs
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20, // Adiciona um espaçamento lateral para os botões
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, // Adiciona um espaçamento inferior entre os botões
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});



