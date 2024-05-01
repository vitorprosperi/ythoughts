import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from 'react-native-maps';
import { Text, View, StyleSheet } from "react-native";
import { requestForegroundPermissionsAsync, 
    getCurrentPositionAsync,
    watchPositionAsync, 
    LocationAccuracy,
    // Importe Constants do Expo
} from 'expo-location';
import Constants from 'expo-constants';
import axios from 'axios'; // Importe a biblioteca axios para fazer solicitações HTTP

export default function Lugares() {
    const [location, setLocation] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef(null);

    async function requestLocationPermissions() {
        const { granted } = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            setLocation(currentPosition);
        }
    }

    useEffect(() => {
        requestLocationPermissions();
    }, []);

    useEffect(() => {
        watchPositionAsync({
            accuracy: LocationAccuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
        }, (response) => {
            setLocation(response);
            if (mapRef.current && !mapLoaded) {
                mapRef.current.animateCamera({
                    pitch: 70,
                    center: response.coords
                });
                setMapLoaded(true);
            }
        });
    }, []);

    useEffect(() => {
        // Solicitação à API do Google Places
        const googlePlacesApiKey = Constants.manifest.extra.googlePlacesApiKey; // Obtenha a chave da API do Google Places do objeto Constants
        const apiUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;

        if (location) {
            axios.get(apiUrl, {
                params: {
                    input: 'clinic',
                    inputtype: 'textquery',
                    key: googlePlacesApiKey, // Use a chave da API do Google Places
                    locationbias: `circle:5000@${location.coords.latitude},${location.coords.longitude}`
                }
            }).then(response => {
                console.log(response.data);
                // Aqui você pode processar a resposta e adicionar marcadores ao mapa
            }).catch(error => {
                console.error('Erro ao fazer solicitação à API do Google Places:', error);
            });
        }
    }, [location]); // Execute esta solicitação sempre que a localização for atualizada

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                    onLayout={() => {
                        if (mapRef.current && !mapLoaded) {
                            mapRef.current.animateCamera({
                                pitch: 70
                            });
                            setMapLoaded(true);
                        }
                    }}
                >
                    {/* Marque a localização atual */}
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    />
                    {/* Adicione mais marcadores aqui com base na resposta da API do Google Places */}
                </MapView>
            ) : (
                <Text>Carregando mapa...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});
