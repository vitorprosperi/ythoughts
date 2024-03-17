import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import auth from "@react-native-firebase/auth";

export default function Form() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  function signUp(){
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('user: ', userCredential);
      }).catch(error =>{
        if(error.code ==='auth/email-already-in-use'){
          console.log('E-MAIL JÁ CADASTRADO');
        }
        if(error.code ==='auth/invalid-email'){
          console.log('E-MAIL INVÁLIDO');
        }
      });
  }

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
