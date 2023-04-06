import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput } from 'react-native';

export default function Cadastrar() {
  const [nome, setNome] = useState();
  const [autor, setAutor] = useState();




 return (
  <SafeAreaView style={styles.container}>
    <ScrollView>

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
        onChangeText={(text)=> setNome(text)}
        value={nome}
        />

        <Text>Uma breve descrição (opcional)</Text>
        <TextInput 
        numberOfLines={10}
        multiline={true} 
        style={{
    height: 100,
    width: '90%',
    margin: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 16,
  
    textAlignVertical: 'top'
    }}/>

      </View>

    </ScrollView>
  </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },
  form: {
    alignItems: 'center'
  },
  txtForm:{
    fontSize: 22

  },
  txtInput:{
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 0,
    width: '90%',
    borderRadius: 3
    
  }


});