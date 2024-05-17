import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import { db, auth } from "../../../Firebase/FirebaseConnection";

export default function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userID = user.uid;
          // Verifica se o usuário está na coleção de psicólogos
          const psicologosCollectionRef = collection(db, 'psicologos');
          const psicologosSnapshot = await getDocs(psicologosCollectionRef);
          const isPsicologo = psicologosSnapshot.docs.some(doc => doc.id === userID);

          if (isPsicologo) {
            navigation.navigate('HomePsic');
          } else {
            const respostasCollectionRef = collection(db, 'usuarios', userID, 'respostas');
            const respostasSnapshot = await getDocs(respostasCollectionRef);
            if (!respostasSnapshot.empty) {
              navigation.navigate('Home');
            } else {
              navigation.navigate('Questionario');
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar o tipo de usuário:', error);
      }
    };

    checkUserType();
  }, []);

  async function signIn() {
    if (!email || !password) {
      Alert.alert('Preencha Todos os Campos!');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        console.log('Usuário logado com sucesso! UID:', user.uid);
        const userID = user.uid;
        const psicologosCollectionRef = collection(db, 'psicologos');
        const psicologosSnapshot = await getDocs(psicologosCollectionRef);
        const isPsicologo = psicologosSnapshot.docs.some(doc => doc.id === userID);

        if (isPsicologo) {
          navigation.navigate('HomePsic');
        } else {
          const respostasCollectionRef = collection(db, 'usuarios', userID, 'respostas');
          const respostasSnapshot = await getDocs(respostasCollectionRef);
          if (!respostasSnapshot.empty) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('Questionario', { userId: user.uid });
          }
        }
      } else {
        console.error('O objeto user é nulo.');
      }
    } catch (error) {
      Alert.alert('E-mail ou Senha incorretos.');
      console.log('Erro ao fazer login:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function navigateCadastro() {
    navigation.navigate('Cadastro');
  };

  // Função para alternar a visibilidade da senha
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Bem-Vindo(a)</Text>
        <View style={styles.inputContainer}>
          <Feather name="mail" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Feather name="lock" size={24} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {/* Ícone do "olho" que alterna a visibilidade da senha */}
          <Feather
            name={showPassword ? "eye" : "eye-off"} // Inverte os ícones dependendo do estado de showPassword
            size={24}
            color="black"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>
        <TouchableOpacity style={styles.buttonLogin} onPress={signIn}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRegister} onPress={navigateCadastro}>
          <Text style={styles.registerText}>Não possui uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    justifyContent: 'center',
  },
  label: {
    color: 'green',
    fontSize: 28,
    marginTop: '14%',
    marginBottom: '8%',
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 12,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  buttonLogin: {
    backgroundColor: 'green',
    padding: 13,
    borderRadius: 30,
    marginTop: 14,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
  },
  registerText:{
    color: '#a1a1a1'
  },
});