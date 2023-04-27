import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image  } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Feather';
import { getDistance } from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import {AuthContext} from '../../context/auth';

export default function Procurar({navigation}) {
  const [region, setRegion] = useState(null);
  const [center, setCenter] = useState(null);
  const [circleRadius, setCircleRadius] = useState(1000);
  const [markers, setMarkers] = useState([]);
  const {user, montaListaParaLocalizacao, userWithBooks} = useContext(AuthContext);
  const mapRef = useRef(null);
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
        setCenter({ latitude, longitude });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  useEffect(()=>{
    montaListaParaLocalizacao()
  },[]);

  function handleProcurar() {
    if (!center) {
      return;
    }
    
  
    let umObjetoData = []
    for(const value in userWithBooks){
      let data = {
        latitude: userWithBooks[value].location.latitude,
        longitude: userWithBooks[value].location.longitude,
        name: userWithBooks[value].nome,
        uid: value,
        urlPerfil: userWithBooks[value].urlPerfil,
        books: userWithBooks[value].books
      }

      umObjetoData.push(data);
    }
    
    const filteredMarkers = umObjetoData.filter((marker) => {
      const distance = getDistance(center, marker);
      return distance <= circleRadius;
    });
    
    setMarkers(filteredMarkers);
  }

  function handleZoomIn() {
    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 1.5,
      longitudeDelta: region.longitudeDelta / 1.5,
    });
  }

  function handleZoomOut() {
    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 3,
      longitudeDelta: region.longitudeDelta * 3,
    });
  }

  if (!region) {
    return <View />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Slider
          style={{ marginTop: 10, marginBottom: 10 }}
          minimumValue={500}
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
        {/* <Marker
          coordinate={region}
          pinColor={'blue'}
          title="Você"
          description="Você está aqui"
          icon={null}
          >
            <View style={{backgroundColor: 'transparent', height: 0, width: 0}}></View>
        </Marker> */}
        <Circle
        center={center}
        radius={circleRadius}
        fillColor={'rgba(0, 0, 255, 0.1)'}
        strokeColor={'blue'}
        />
        {markers.map((marker, index) => (
        <Marker key={index} coordinate={marker} title={marker.name} onPress={()=> {
          
          navigation.navigate('PerfilUsers', {selectedMarker: marker})
        }}>
          <View style={{ height: '100%', width: '100%', }}>
            {marker.urlPerfil ? (
              <Image style={styles.imgMarker} source={{uri: marker.urlPerfil}}/>
            ):
            <Image style={styles.imgMarker} source={require('../../assets/user.png')}/>
            }
            {/* <Image style={{width: 40, height: 40, borderRadius: 25, borderColor: 'rgba(20,100,250,0.5)', borderWidth: 2}}source={{uri: 'https://picsum.photos/200'}}/> */}
          </View>
        </Marker>
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
  imgMarker:{
    width: 40, 
    height: 40, 
    borderRadius: 25, 
    borderColor: 'rgba(20,100,250,0.5)', 
    borderWidth: 2,

  }
});