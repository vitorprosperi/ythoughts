import React from "react";
import {View, Text, TextInput, Button} from "react-native";

export default function Form(){
    return(
      <View>
        <View>
            <Text>E-MAIL</Text>
            <TextInput
            placeholder="teste.teste@gmail.com"
            />
            <Text>SENHA</Text>
            <TextInput
            placeholder="suasenhasupersegura"
            />
            <Button title="entrar"/>
        </View>
      </View>
    );
}