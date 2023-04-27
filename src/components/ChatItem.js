import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import UserDefaultImage from '../assets/user.png';
import {AuthContext} from '../context/auth';

export default function ChatItem({navigation, chat, contatoId}) {
    const {user} = useContext(AuthContext);
    const [userPair] = chat.users.filter((u) => u.id !== user.uid);
  
    // function abrirChat(){

    //   const result = chat.users.find(userFind => userFind.id !== user.uid);
      
    //   let params = {
    //     contactUser: result.id,
    //     nameUser: 'Nao sei o nome',
    //     currentUser: user.uid,
    //     chat: chat,
    //     messageId: chat.id
    //   }
    //   navigation.navigate('Chat', params);
    // }
    
 return (
    <TouchableNativeFeedback
      onPress={() => navigation.navigate('Chat', {contatoId})}>
    <View key={chat.id} style={styles.chatItemContainer}>
      <Image source={UserDefaultImage} style={styles.userPairImage} />
      <View>
        <Text style={styles.userPairPhone}>{userPair.phone}</Text>
        <Text style={styles.chatLastMessage}>
          {chat.messages[chat.messages.length - 1]?.content}
        </Text>
      </View>
    </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
    chatItemContainer: {
      flexDirection: 'row',
      marginVertical: 16,
    },
    userPairImage: {
      width: 38,
      height: 38,
      marginRight: 12,
    },
    userPairPhone: {
      fontWeight: '500',
      marginBottom: 6,
    },
    chatLastMessage: {
      fontWeight: '300',
      color: '#999',
    },
    container: {
      marginTop: 16,
      marginHorizontal: 16,
    },
  });