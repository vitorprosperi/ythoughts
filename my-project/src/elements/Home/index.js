import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, 
    TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../Firebase/FirebaseConnection';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import CustomActionSheet from '../../CustomActionSheet'; // Importe o componente CustomActionSheet

export default function Home() {
    const navigation = useNavigation();
    const [anotacoes, setAnotacoes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedAnotacaoId, setSelectedAnotacaoId] = useState(null); // Estado para controlar a anotação selecionada
    const [actionSheetVisible, setActionSheetVisible] = useState(false); // Estado para controlar a visibilidade do menu de opções

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

    const handleOptionsPress = (id) => {
        setSelectedAnotacaoId(id); // Define a anotação selecionada
        setActionSheetVisible(true); // Mostra o menu de opções
    };

    const handleActionSheetSelect = (index) => {
        if (index === 0) {
            handleDelete(selectedAnotacaoId);
        }
        setSelectedAnotacaoId(null); // Limpa a anotação selecionada
        setActionSheetVisible(false); // Esconde o menu de opções
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, `usuarios/${auth.currentUser.uid}/anotacoes/${id}`));
            fetchAnotacoes();
            console.log('Anotação deletada com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar anotação:', error);
        }
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
                    <Text style={styles.text}>Suas anotações serão exibidas aqui!</Text>
                ) : (
                    <Text style={styles.text}>Suas anotações:</Text>
                )}
                {anotacoes.map(anotacao => (
                    <View key={anotacao.id}>
                        <View style={styles.dataContainer}>
                            <Text style={styles.dataText}>{anotacao.data}</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('AcessarAnotacao', { anotacaoTexto: anotacao.anotacao, id: anotacao.id })}
                        >
                            <View style={styles.anotacaoContainer}>
                                <Text style={styles.anotacaoText}>{anotacao.anotacao}</Text>
                                <TouchableOpacity onPress={() => handleOptionsPress(anotacao.id)}>
                                    <Text style={styles.opcoesText}>...</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
                <Button title="Sair" onPress={signOut} />
            </View>
            <CustomActionSheet
                visible={actionSheetVisible}
                options={['Apagar', 'Cancelar']}
                onSelect={handleActionSheetSelect}
                onCancel={() => setActionSheetVisible(false)}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    opcoesText: {
        fontSize: 20,
        marginRight: 10,
    },
    anotacaoText: {
        fontSize: 16,
        flex: 1, // Ocupa o restante do espaço horizontal disponível
    },
    dataContainer: {
        marginRight: 10,
    },
    dataText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
});
