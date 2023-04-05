import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/auth';

export default function SignUp({navigation}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {signUp} = useContext(AuthContext);


  function handleSignUp(){
    signUp(email, password, nome)
  }

 return (
  <View style={styles.container}>

    <Text style={styles.title}>Cadastrar usuário</Text>

    <TextInput 
    style={styles.txtInp}
    maxLength={40}
    placeholder='Nome'
    value={nome}
    onChangeText={(text)=> setNome(text)}
    />

    <TextInput 
    style={styles.txtInp}
    maxLength={40}
    placeholder='Email'
    value={email}
    onChangeText={(text)=> setEmail(text)}
    />

    <TextInput 
    style={styles.txtInp}
    maxLength={40}
    placeholder='Senha'
    value={password}
    onChangeText={(text)=> setPassword(text)}
    />

    <TouchableOpacity 
    style={styles.btnCriar}
    onPress={()=> handleSignUp()}
    >
      <Text style={styles.txtBtnCriar}>Criar conta</Text>
    </TouchableOpacity>

  </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C1ADA9'
  },
  title:{
    marginBottom: 10,
    fontSize: 22,
    color: '#000'
  },
  txtInp: {
    backgroundColor: '#fff',
    width: 320,
    height: 50,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    elevation: 2,
    padding: 10
  },
  btnCriar:{
    backgroundColor: '#fff',
    width: 180,
    height: 39,
    marginBottom: 15,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7E5E54',
    elevation: 2,
  },
  txtBtnCriar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }

});