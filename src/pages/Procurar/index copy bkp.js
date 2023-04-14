import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Feather';
import { getDistance } from 'geolib';

export default function Procurar() {
  const [region, setRegion] = useState({
    latitude: -20.45722128114959,
    longitude: -54.65427340435321,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });

  const [center, setCenter] = useState({
    latitude: region.latitude,
    longitude: region.longitude,
  })

  const [circleRadius, setCircleRadius] = useState(1000);
  const [markers, setMarkers] = useState([]);

  const mapRef = useRef(null);

  function handleProcurar() {

    const foundMarkers = [
      { latitude: region.latitude + 0.001, longitude: region.longitude + 0.001, name: 'Usuário 1' },
      { latitude: region.latitude - 0.002, longitude: region.longitude - 0.002, name: 'Usuário 2' },
      { latitude: -20.446892293491743, longitude: -54.6283418069997, name: 'Usuário 3' },
    ];

    const filteredMarkers = foundMarkers.filter(marker => {
      const distance = getDistance(center, marker);
      return distance <= circleRadius;
    });

    setMarkers(filteredMarkers);
  }

  function handleZoomIn() {
    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  }

  function handleZoomOut() {
    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 4,
      longitudeDelta: region.longitudeDelta * 4,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Slider
          style={{ marginTop: 10, marginBottom: 10 }}
          minimumValue={300}
          maximumValue={15000}
          step={100}
          value={circleRadius}
          onValueChange={(value) => setCircleRadius(value)}
        />

        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10 }} onPress={handleProcurar}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Procurar</Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.mapa}
        region={region}
        scrollEnabled={true}
        // onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker coordinate={region} pinColor={'blue'} title='Você' description='Você está aqui' icon={
          {
            uri: 'https://i.ibb.co/prB6c5G/Novo-Projeto.png',
            width: 10,
            height: 10
          }}/>
        <Circle center={center} radius={circleRadius} fillColor={'rgba(0, 0, 255, 0.1)'} strokeColor={'blue'} />

        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} title={marker.name} />
        ))}
      </MapView>

      <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
        <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
        <Icon name="zoom-in" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
        <Icon name="zoom-out" size={20} color="#000" />
        </TouchableOpacity>
      </View>
       
</View>
);
}

const styles = StyleSheet.create({
mapa: {
width: '100%',
height: '100%',
},
buttonsContainer: {
position: 'absolute',
top: 10,
right: 10,
flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
},
button: {
backgroundColor: 'rgba(255, 255, 255, 0.7)',
padding: 10,
marginBottom: 10,
borderRadius: 5,
},
buttonText: {
color: 'black',
textAlign: 'center',
},
});
