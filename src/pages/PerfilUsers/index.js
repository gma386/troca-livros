import React, {useState, useEffect, useContext} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Button, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper';
import {AuthContext} from '../../context/auth';

export default function PerfilUsers({route, navigation}) {
  const {selectedMarker} = route.params
  const [selectedMarkerState, setSelectedMarkerState] = useState(selectedMarker);
  const [books, setBooks] = useState(selectedMarkerState.books);
  const {user, listaChatsDoUser} = useContext(AuthContext);

  const { width } = Dimensions.get('window')

  function abrirChat(){
    
    navigation.navigate('Mensagens', {screen: 'Chat', params: {
      contatoId: selectedMarkerState.uid,
    }})
  }
  
  function montaSwiper(){
    return (
      <View style={{flex:1}}>
        {Object.keys(books).map(bookKey => (
          <TouchableOpacity key={bookKey} onPress={() => alert(JSON.stringify(books[bookKey], selectedMarkerState))}>
            <View style={{marginBottom: 16, backgroundColor: '#ddd',}}>
              <Swiper
                showsButtons={true}
                loop={false}
                width={width}
                height={300}
              >
                {books[bookKey].images.map(image => (
                  <View key={image}>
                    <Image style={{ width: '100%', height: 300 }} source={{ uri: image }} />
                  </View>
                ))}
              </Swiper>
              <Text style={styles.titulos}>{books[bookKey].nome}</Text>
              <Text style={styles.descricao}>{books[bookKey].descricao}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
  
  

 return (
  <ScrollView style={styles.container}>
    <View style={{alignItems: 'center'}}>
      {selectedMarkerState.urlPerfil ? (
        <Image style={styles.imgUser} source={{uri: selectedMarkerState.urlPerfil}}/>
      ):(
        <Image style={styles.imgUser} source={require('../../assets/user.png')}/>
      )}
    
    <Text style={styles.nameUser}> { selectedMarkerState.name} </Text>
    {/* <Button title='Mudar Pagina' onPress={()=> navigation.navigate('Mensagens', {screen: 'Chat', params})}/> */}
    <Button title='Mudar Pagina' onPress={()=> abrirChat()}/>
    </View>

    {montaSwiper()}
    
   </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgUser: {
    marginTop: 10,
    width: 100, 
    height: 100,
    borderRadius: 25,
    marginBottom: 12,
  },
  nameUser: {
    fontSize: 20,
    color: 'black',
    marginBottom: 12,
  },
  titulos: {
    color: '#222',
    fontSize: 22,
    paddingStart: 8
  },
  descricao: {
    color: '#333',
    paddingStart: 12,
    paddingBottom: 4,
    fontSize: 16,
  }

});