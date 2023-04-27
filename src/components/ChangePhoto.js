import React, {useContext} from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AuthContext} from '../context/auth';

export default function ChangePhoto({closeChangePhoto}) {
  const {uploadPhoto} = useContext(AuthContext);

  async function camera(){
    let options = {
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'front',
      maxWidth: 500,
      maxHeight: 500,
      saveToPhotos: true
    }
    await launchCamera(options).then((response)=>{
      if(response.assets && response.assets.length > 0){
        let fileName = response.assets[0].fileName;
        let uri = response.assets[0].uri;
        uploadPhoto(fileName, uri);
        closeChangePhoto()
      }
    })
  }

  async function gallery(){
    let options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 700,
      maxHeight: 700,
    }
    await launchImageLibrary(options).then((response)=>{
      console.log(response)
      if(response.assets && response.assets.length > 0){
        let fileName = response.assets[0].fileName;
        let uri = response.assets[0].uri;
        uploadPhoto(fileName, uri);
        closeChangePhoto()
      }
    })
  }



 return (
  <View style={styles.container}>
    <Text style={styles.text}>Seja Bem-vindo!</Text>
    <Button title='camera' onPress={()=> camera()}/> 
    <Button title='galeria' onPress={()=> gallery()}/> 
    <Button title='Cancelar' onPress={()=> closeChangePhoto()}/>
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#292929',
        width: '80%',
        height: '50%',
        borderRadius: 25,
        padding: 20,
        alignItems: 'center',
    },
    text:{
      color: '#fff',
      fontSize: 28
    }

});