import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase/FirebaseConnection";

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signUp(){
   await createUserWithEmailAndPassword(auth, email, password)
    .then(value => {
      console.log('Cadastrado com sucesso! \n' + value.user.uid);
    })
    .catch(error => console.log(error));
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
        <Button title="Cadastrar" onPress={signUp} />
      </View>
    </View>
  );
}
