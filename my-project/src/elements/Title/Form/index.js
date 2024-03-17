import React from "react";
import {View, Text, TextInput} from "react-native";

export default function Form(){
    return(
      <View>
        <View>
            <Text>E-MAIL</Text>
            <TextInput></TextInput>
            <Text>SENHA</Text>
            <TextInput></TextInput>
        </View>
      </View>
    );
}