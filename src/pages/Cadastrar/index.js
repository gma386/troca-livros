import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Button } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AuthContext} from '../../context/auth';
import Geolocation from '@react-native-community/geolocation';

export default function Cadastrar() {
  const [nome, setNome] = useState();
  const [autor, setAutor] = useState();
  const [editora, setEditora] = useState();
  const [genero, setGenero] = useState();
  const [descricao, setDescricao] = useState();
  const [images, setImages] = useState([]);
  const [imagesBooks, setImagesBooks] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [location, setLocation] = useState(null);

  const {cadastrarLivro} = useContext(AuthContext);

  //GENEROS
  const booksItem =  [
  {key: 0, nome: 'Escolha o gênero'},
  {key: 1, nome: 'Fantasia'},
  {key: 2, nome: 'Ficção'},
  {key: 3, nome: 'Ação'},
  {key: 4, nome: 'Aventura'},
  {key: 5, nome: 'Horror'},
  {key: 6, nome: 'Thriller'},
  {key: 7, nome: 'Suspense'},
  {key: 8, nome: 'Romance'},
  {key: 9, nome: 'Novela'},
  {key: 10, nome: 'Conto'},
  {key: 11, nome: 'Biografia'},
  {key: 12, nome: 'Gastronomia'},
  {key: 13, nome: 'Arte e Fotografia'},
  {key: 14, nome: 'Autoajuda'}, 
  {key: 15, nome: 'História'},
  {key: 16, nome: 'Viagem'},
  {key: 17, nome: 'Infantil'},
  {key: 18, nome: 'Humor'},
  {key: 19, nome: 'Ensaios'},
  {key: 20, nome: 'Religião'},
  {key: 21, nome: 'Espiritualidade'},
  {key: 22, nome: 'Tecnologia'},
  {key: 23, nome: 'Ciência'},
  {key: 24, nome: 'Informática'},
  {key: 25, nome: 'Outro'}
  ]
  //MONTA PICKER DE GENEROS
  let items = booksItem.map( (v,k)=>{
    return <Picker.Item key={k} value={v.nome} label={v.nome} />
  })

  //POSIÇÃO DO USER
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    
  }, []);

  //ATUALIZA AS IMAGES TIRADAS CONFORME images É MODIFICADO
  useEffect(() => {
    let newImagesBooks = images.map((link, k)=>{
      return <TouchableOpacity key={k} onPress={()=> apagarFoto(k)}><Image key={k} style={{width: 70, height: 70, padding: 10, margin: 10, borderRadius: 5}} source={{uri: link}}/></TouchableOpacity>
    })
    setImagesBooks(newImagesBooks);
	}, [images])

  function apagarFoto(index){
    Alert.alert(
      'Apagar Foto',
      'Você quer apagar a foto ?',
      [
        {
          text: 'Cancel',
          // onPress: () => Alert.alert('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Apagar',
          onPress: () => {
            let newImage = [...images];
            newImage.splice(index,1);
            setImages(newImage);
            let newFileName = [...fileName];
            newFileName.splice(index,1);
            setFileName(newFileName)
          },
          style: 'default',
        },
      ],
      {
        cancelable: true
      },
    );
  }

  async function camera(){
    if(images.length > 2){
      Alert.alert('Limite Máximo', 'Você atingiu o limite máximo de fotos.')
      return;
    }
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
        let uri = response.assets[0].uri;
        console.log('meu response' , response)
        
        let newImages = [...images, uri];
        setImages(newImages);

        let localFileName = response.assets[0].fileName;
        let newFileName = [...fileName, localFileName]
        setFileName(newFileName);
      }
    })
    
  }

  function handleCadastrar(dados, dadosLocation){
    cadastrarLivro(dados, dadosLocation)
  }

 return (
  <SafeAreaView style={styles.container}>

      <View style={styles.form}>

        <Text style={styles.txtForm}>Cadastrar um Livro</Text>

        <TextInput 
        style={styles.txtInput} 
        placeholder='Nome do Livro'
        underlineColorAndroid ='transparent'
        onChangeText={(text)=> setNome(text)}
        value={nome}
        />

        <TextInput 
        style={styles.txtInput} 
        placeholder='Autor do Livro'
        underlineColorAndroid ='transparent'
        onChangeText={(text)=> setAutor(text)}
        value={autor}
        />

        <TextInput 
        style={styles.txtInput} 
        placeholder='Editora'
        underlineColorAndroid ='transparent'
        onChangeText={(text)=> setEditora(text)}
        value={editora}
        />

        <View style={styles.viewPicker}>
         <Picker
            selectedValue={genero}
            onValueChange={(itemValue, itemIndex) =>
              setGenero(itemValue)
            }>
            {items}
          </Picker>
        </View>

        <Text>Uma breve descrição (opcional)</Text>

        <TextInput 
        numberOfLines={10}
        multiline={true} 
        style={styles.txtDescricao}
        onChangeText={(text)=> setDescricao(text)}
        />

        

        <View style={styles.viewCamera}>

          <TouchableOpacity onPress={()=> camera()}>
            <Feather name='camera' size={30}/>
          </TouchableOpacity>
          <Text>Selecione fotos</Text>
          <View style={styles.viewImg}>
            {imagesBooks}
          </View>
    
        </View>

        <Button title='cadastrar' onPress={()=> {
          console.log('genero> ', genero)

          if (genero === 'Escolha o gênero' || genero == undefined) {
            alert('Por favor, selecione um gênero');
            return;
          }

          if(images == ''){
            alert('Adicione uma foto')
            return;
          }

          if(nome == undefined || autor == undefined || editora == undefined || descricao == undefined){
            alert('Preencha todos os campos')
            return;
          }
          
          let dados = {
            nome: nome,
            autor: autor,
            editora: editora,
            genero: genero,
            descricao: descricao,
            images: images,
            fileName: fileName,
          }
          let dadosLocation = {
            latitude: location.latitude,
            longitude: location.longitude
          }

          handleCadastrar(dados, dadosLocation)
        }
        }/>

      </View>

  </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },
  form: {
    alignItems: 'center',
    flex: 1,
  },
  txtForm:{
    fontSize: 22
  },
  txtInput:{
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    paddingLeft: 15,
    fontSize: 16,
    borderBottomWidth: 0,
    width: '90%',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  txtDescricao:{
    height: 70,
    width: '90%',
    margin: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#bbb',
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  viewPicker: {
    height: 50,
    width: '90%',
    justifyContent: 'center',
    backgroundColor: '#fff', 
    margin: 10, 
    borderRadius: 3, 
    borderWidth: 1,
    borderColor: '#bbb',
  },
  viewCamera: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    paddingTop: 10,
  },
  viewImg: {
    flexDirection: 'row',
    paddingTop: 10,
  }
});