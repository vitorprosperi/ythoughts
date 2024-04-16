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
        navigation.navigate('Questionario', { userId: user.uid });
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
        <Text style={styles.label}>E-MAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="teste.teste@gmail.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          placeholder="suasenhasupersegura"
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
