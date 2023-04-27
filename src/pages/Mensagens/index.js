import React, {useState, useContext, useEffect} from 'react';
import { View, Text, SafeAreaView, StyleSheet, } from 'react-native';
import ChatItem from '../../components/ChatItem';
import {AuthContext} from '../../context/auth';

export default function Mensagens({navigation}) {
  const {listarTodosChatsDoUser, user} = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  useEffect(()=>{

    async function fetchData(){
      cleanupFunction = await listarTodosChatsDoUser(setChats)
    }
    fetchData();
    return () => {
      if (cleanupFunction) {
        cleanupFunction(); // Chama a função de limpeza para remover o listener
      }
    }
    
  },[])

  function findContatoId(users){
    let contatoId = users.find(element => element.id !== user.uid)
    return contatoId ? contatoId.id : null;
    
  }

 return (
  <SafeAreaView style={styles.container}>
  <Text style={styles.title}>Chats</Text>
  {chats.length > 0 ? (
    chats.map((chat) => {
      let contatoId = findContatoId(chat.users)
      
      return (
        <ChatItem key={chat.id} chat={chat} contatoId={contatoId} navigation={navigation} />
        )
  })
) : (
  <Text>Nenhuma mensagem</Text>
)}
</SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 32,
  },
})