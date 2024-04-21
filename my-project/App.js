import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './src/elements/Login';
import Home from './src/elements/Home';
import { Cadastro } from './src/elements/Cadastro';
import { auth } from './Firebase/FirebaseConnection';
import { Questionario } from './src/elements/Questionario';
import { Addform } from './src/Addform';
import AcessarAnotacao from './src/acessarform';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setInitialRoute('Home');
      }
    });
  
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Form}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="Questionario"
          component={Questionario}
          options={{ title: 'Questionario' }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ title: 'Cadastro' }}
        />
          <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Addform"
          component={Addform}
          options={{ title: 'Criar Anotação' }}
        />
        <Stack.Screen
          name="AcessarAnotacao"
          component={AcessarAnotacao}
          options={{ title: 'Editar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
