import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Form from './src/elements/Login';
import { Cadastro } from './src/elements/Cadastro';
import { auth } from './Firebase/FirebaseConnection';
import { Questionario } from './src/elements/Questionario';
import { Addform } from './src/Addform';
import AcessarAnotacao from './src/acessarform';
import Home from './src/elements/Home';
import Result from './src/elements/Resultado';
import Lugares from './src/elements/Lugares';
import Perfil from './src/elements/Perfil';
import { Feather } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen 
      name="Início" 
      component={Home}
      options={{
        tabBarIcon: ({color, size}) => <Feather name="home" color={color} size={size}/>
      }} 
      />
      <Tab.Screen 
      name="Dicas" 
      component={Result}
      options={{
        tabBarIcon: ({color, size}) => <Feather name="anchor" color={color} size={size}/>
      }}  
      />
      <Tab.Screen 
      name="Lugares" 
      component={Lugares}
      options={{
        tabBarIcon: ({color, size}) => <Feather name="map" color={color} size={size}/>
      }}  
      />
      <Tab.Screen 
      name="Perfil" 
      component={Perfil}
      options={{
        tabBarIcon: ({color, size}) => <Feather name="user" color={color} size={size}/>
      }}  
      />
    </Tab.Navigator>
  );
};

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
          options={{ title: 'Login' ,headerBackVisible: false,}}
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
          component={HomeTabs} // Renderiza as tabs quando o usuário estiver na tela "Home"
          options={({ navigation }) => ({
          headerBackVisible: false,
          title: '',
          })}
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
