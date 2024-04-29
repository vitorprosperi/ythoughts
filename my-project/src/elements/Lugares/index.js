import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from 'react-native-maps';
import { Text, View, StyleSheet } from "react-native";
import { requestForegroundPermissionsAsync, 
    getCurrentPositionAsync,
    watchPositionAsync, 
    LocationAccuracy
} from 'expo-location';

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
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    />
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
