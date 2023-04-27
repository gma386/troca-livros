import React, {Fragment, useState, useContext, useEffect} from 'react';
import {KeyboardAvoidingView,Platform,SafeAreaView,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Balloon from '../../components/Balloon';
import {AuthContext} from '../../context/auth';

export default function Chat({route}) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState('');
  const [firstChat, setFirstChat] = useState('');
  const {listaUmChatDoUser, user, sendMessage} = useContext(AuthContext);
  const {contatoId} = route.params;
  const KEYBOARD_AVOIDING_BEHAVIOR = Platform.select({
      ios: 'padding',
      android: 'height',
  });

  useEffect(() => {
    let cleanupFunction;

    async function fetchData(){
      cleanupFunction = await listaUmChatDoUser(contatoId, setChat)
    }
    fetchData();

    return () => {
      if (cleanupFunction) {
        cleanupFunction(); // Chama a função de limpeza para remover o listener
      }
    }
    
  },[chat, firstChat])

  function formatarDataParaString(data) {
    function padZero(valor) {
      return valor.toString().padStart(2, '0');
    }
    function getTimezoneOffsetString(offset) {
      const sinal = offset < 0 ? '+' : '-';
      const horas = padZero(Math.abs(Math.floor(offset / 60)));
      const minutos = padZero(Math.abs(offset % 60));
      return `${sinal}${horas}:${minutos}`;
    }
    const ano = data.getFullYear();
    const mes = padZero(data.getMonth() + 1);
    const dia = padZero(data.getDate());
    const hora = padZero(data.getHours());
    const minuto = padZero(data.getMinutes());
    const segundo = padZero(data.getSeconds());
    const fusoHorario = getTimezoneOffsetString(data.getTimezoneOffset());
  
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}${fusoHorario}`;
  }
  
  function handleSendMessage(text){
    let dataAtual = new Date();
    const dataFormatada = formatarDataParaString(dataAtual);
    
    let data = {
      content: text,
      sent: dataFormatada,
      sentBy: user.uid,
    };
    sendMessage(data, contatoId, setFirstChat);
  }


 return (
    <Fragment>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {chat ? (
        Object.values(chat.messages).sort((a, b) => new Date(a.sent) - new Date(b.sent)).map((message) => (
          <Balloon key={message.id} message={message} currentUser={user.uid} />
        ))
        ) : (
          null
        )}
    </ScrollView>
    <KeyboardAvoidingView
      behavior={KEYBOARD_AVOIDING_BEHAVIOR}
      keyboardVerticalOffset={76}>
      <SafeAreaView>
        <View style={styles.messageTextInputContainer}>
          <TextInput
            style={styles.messageTextInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.light}
            multiline
            value={message}
            onChangeText={(text)=> setMessage(text)}
          />
          <TouchableOpacity
            style={styles.sendButton}
            disabled={!message}
            onPress={() => handleSendMessage(message)}>
            <Text>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  </Fragment>
  );
}

const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      marginHorizontal: 16,
    },
    scrollViewContainer: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      top: 10,
    },
    sendButton: {
      backgroundColor: Colors.primary,
      color: Colors.white,
      height: 40,
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      marginRight: 5,
    },
    messageTextInputContainer: {
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      paddingVertical: 5,
      borderColor: 'transparent',
      borderTopColor: Colors.light,
      alignItems: 'center',
      flexDirection: 'row',
    },
    messageTextInput: {
      flex: 1,
      minHeight: 40,
      maxHeight: 90,
      paddingHorizontal: 12,
      fontSize: 17,
      paddingTop: 8,
      marginHorizontal: 5,
      borderColor: Colors.light,
      borderWidth: 1,
      backgroundColor: Colors.white,
      borderRadius: 20,
    },
  });