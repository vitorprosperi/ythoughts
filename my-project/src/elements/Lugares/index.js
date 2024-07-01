import React, { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync, 
    getCurrentPositionAsync,
    watchPositionAsync, 
    LocationAccuracy
} from 'expo-location';
import axios from 'axios'; 

export default function Lugares() {
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
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
        });
    }, []);

    useEffect(() => {
        const googlePlacesApiKey = "AIzaSyCbI873M-Sz3uWhpEiJC9_CZDEjNjodpZE";
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    
        if (location) {
            axios.get(apiUrl, {
                params: {
                    location: `${location.coords.latitude},${location.coords.longitude}`,
                    radius: 10000,
                    keyword: 'psicólogo,psiquiatra',
                    key: googlePlacesApiKey,
                }
            }).then(response => {
                if (response.data && response.data.results) {
                    const hospitals = response.data.results;
                    const markersData = hospitals.map(hospital => ({
                        latitude: hospital.geometry.location.lat,
                        longitude: hospital.geometry.location.lng,
                        title: hospital.name,
                        description: hospital.vicinity
                    }));
                    setMarkers(markersData);
                } else {
                    console.warn('Nenhum hospital encontrado.');
                }
            }).catch(error => {
                console.error('Erro ao fazer solicitação à API do Google Places:', error);
            });
        }
    }, [location]);
    
    // Renderizar o mapa com marcadores
    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {/* Adicionar marcador da sua localização */}
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Sua Localização"
                        pinColor="yellow" // Definindo a cor do marcador para amarelo
                    />
                    
                    {/* Adicionar marcadores dos hospitais */}
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Carregando mapa...</Text>
                </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
    },
});
