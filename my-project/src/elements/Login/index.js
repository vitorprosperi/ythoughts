import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase/FirebaseConnection";
import { useNavigation } from '@react-navigation/native';

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  async function signUp() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário cadastrado com sucesso! \n' + userCredential.user.uid);
      // Aqui você pode redirecionar o usuário para a próxima tela após o cadastro
    } catch (error) {
      console.log('Erro ao cadastrar usuário:', error.message);
    }
  };

  async function signIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuário logado com sucesso! \n' + userCredential.user.uid);
      navigation.navigate('Home');
    } catch (error) {
      console.log('Erro ao fazer login:', error.message);
    }
  };

  return (
    <View>
      <View>
        <Text>E-MAIL</Text>
        <TextInput
          placeholder="teste.teste@gmail.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text>SENHA</Text>
        <TextInput
          placeholder="suasenhasupersegura"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Entrar" onPress={signIn} />
        <Button title="Cadastrar" onPress={signUp} />
      </View>
    </View>
  );
}
