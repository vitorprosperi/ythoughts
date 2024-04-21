import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomActionSheet = ({ visible, options, onSelect }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onSelect(-1)} // Chame onSelect com um valor diferente para identificar que o usuário cancelou
        >
            <View style={styles.container}>
                <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => onSelect(index)}
                        >
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingBottom: 10,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default CustomActionSheet;
