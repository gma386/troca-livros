import React, {useState, useContext} from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { AuthContext }  from '../../context/auth';

export default function SignIn({navigation}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const {signIn} = useContext(AuthContext);

  function handleSignIn(){
    signIn(email, password);
  }

 return (
  
  <View style={styles.container}>
    <KeyboardAvoidingView style={styles.keyboard}>

      <Image 
      style={styles.background}
      source={require('../../assets/Background.png')}
      />
      <View style={styles.viewLogo}>

        <Image 
        style={styles.logo}
        source={require('../../assets/Logo.png')}
        />

      </View>

      <View style={styles.viewInputs}>

        <TextInput
        style={styles.txtInputLogin}
        placeholder='Login'
        autoCorrect={false}
        autoCapitalize='none'
        value={email}
        onChangeText={(e)=> setEmail(e)}

        />
        <TextInput
        style={styles.txtInputLogin}
        placeholder='Senha'
        autoCorrect={false}
        autoCapitalize='none'
        value={password}
        onChangeText={(e)=> setPassword(e)}
        />

        <TouchableOpacity 
        style={styles.btnInput}
        onPress={()=> handleSignIn()}
        >
          <Text style={styles.btnText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
          <Text style={styles.txtSignUp}>Criar conta</Text>
        </TouchableOpacity>

      </View>

    </KeyboardAvoidingView>
  </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  keyboard:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background:{
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  viewLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInputs: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
  },
  txtInputLogin: {
    backgroundColor: '#fff',
    width: 230,
    height: 39,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    elevation: 2,
    padding: 10
  },
  btnInput: {
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
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  txtSignUp:{
    color: '#333',
    fontSize: 15,
  }

});