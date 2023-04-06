import 'react-native-gesture-handler';
import React, { useContext, useState } from 'react';
import { View, Text, Button, ScrollView, SafeAreaView, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AuthContext }  from '../../context/auth';
import ChangePhoto from '../../components/ChangePhoto';
import { BlurView } from "@react-native-community/blur";
import Feather from 'react-native-vector-icons/Feather';


export default function Home() {
  const [changePhotoVisible, setChangePhotoVisible] = useState(false);
  const { signOut, user } = useContext(AuthContext);
  
  function handleLogout(){
    signOut();
  }

  function openChangePhoto(){
    setChangePhotoVisible(true);
  }

  function closeChangePhoto(){
    setChangePhotoVisible(false);
  }
 
  return (

    <SafeAreaView style={styles.container}>
      <ScrollView>
        
        <View style={styles.user}>

          <TouchableOpacity onPress={()=> handleLogout()}>
            <Feather name='log-out' color='#000' size={20}  />
          </TouchableOpacity>

          <TouchableOpacity onPress={openChangePhoto}>
            {user.urlPerfil ? (
              <Image style={styles.imgUser} source={{uri: user.urlPerfil}}/>
            ):
            <Image style={styles.imgUser} source={require('../../assets/user.png')}/>
            }
           
          </TouchableOpacity>

          <Text style={styles.nameUser}>{user.nome}</Text>

        </View>
        
        
        {changePhotoVisible ? (
          <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        ): null}
        

        <Modal transparent={true} animationType='fade' visible={changePhotoVisible}>
          <View style={styles.changePhoto}>
            <ChangePhoto closeChangePhoto={closeChangePhoto}/>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  user: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'azure'
  },
  imgUser: {
    height: 100,
    width: 100,
    borderRadius: 100
  },
  nameUser: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000'
  },


  blur:{
    zIndex: 90
  },
  changePhoto: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  }


})