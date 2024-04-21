import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, doc, getDocs } from 'firebase/firestore';

export default function Home() {
    const navigation = useNavigation();
    const [anotacoes, setAnotacoes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnotacoes();
    }, []);

    const fetchAnotacoes = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            const userID = user.uid;
            const userDocRef = doc(db, 'usuarios', userID);
            const anotacoesCollectionRef = collection(userDocRef, 'anotacoes');
            const querySnapshot = await getDocs(anotacoesCollectionRef);
            const fetchedAnotacoes = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ordena as anotações pela data de forma decrescente
            fetchedAnotacoes.reverse();

            setAnotacoes(fetchedAnotacoes);
        } catch (error) {
            console.error('Erro ao recuperar anotações:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchAnotacoes();
    };

    function abrirform() {
        navigation.navigate('Addform');
    }

    const signOut = () => {
        auth.signOut().then(() => {
            console.log("Usuário desconectado com sucesso!");
            navigation.navigate('Login');
        }).catch((error) => {
            console.log("Erro ao desconectar o usuário:", error.message);
        });
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <TouchableOpacity onPress={abrirform}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../tcc/imagens/mais.png')}
                        style={styles.image}
                    />
                </View>
            </TouchableOpacity>
            <View>
                {anotacoes.length === 0 ? (
                    <Text style={styles.text}>Suas anotações serão exibidas aqui</Text>
                ) : (
                    <Text style={styles.text}>Suas anotações:</Text>
                )}
                {anotacoes.map(anotacao => (
                    <TouchableOpacity 
                        key={anotacao.id} 
                        onPress={() => navigation.navigate('AcessarAnotacao', { anotacaoTexto: anotacao.anotacao, id: anotacao.id })}
                     >
                        <View style={styles.anotacaoContainer}>
                             <Text style={styles.dataText}>{anotacao.data}</Text>
                            <Text style={styles.anotacaoText}>{anotacao.anotacao}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                <Button title="Sair" onPress={signOut} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    image: {
        width: 35,
        height: 35,
    },
    text: {
        marginTop: 50,
        fontSize: 20,
    },
    anotacaoContainer: {
        backgroundColor: '#AAE7F4',
        padding: 10,
        marginVertical: 5,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
    },
    anotacaoText: {
        fontSize: 16,
    },
    dataText: { // Estilo para a data
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
});
