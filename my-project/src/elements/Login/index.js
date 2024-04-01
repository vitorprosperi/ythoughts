import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../../Firebase/FirebaseConnection";

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  function navigateCadastro() {
    navigation.navigate('Cadastro');
  };

  async function signIn() {

    if(!email || !password){
      Alert.alert('Preencha Todos os Campos!');
      return;
    };

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuário logado com sucesso! \n' + userCredential.user.uid);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('E-mail ou Senha incorretos.');
      console.log('Erro ao fazer login:', error.message);
    }
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
