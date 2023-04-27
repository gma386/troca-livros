import React, { useState, createContext, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext({});

export default function AuthProvider({ children}) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userWithBooks, setUserWithBooks] = useState(null);

	//useEffect (ciclo de vida) - Verifica se dentro do AsyncStorage já possui algum usuário salvo, para não deslogar o usuário a cada atualização
	useEffect(() => {
		async function loadStorage(){
			const storageUser = await AsyncStorage.getItem('Auth_user');

			if(storageUser){
				setUser(JSON.parse(storageUser));
				
			}
			setLoading(false);
		}
		loadStorage();
	})

	//LOGIN NO SISTEMA
	async function signIn(email, password){
		await auth().signInWithEmailAndPassword(email, password)
		.then(async (value)=>{
			let uid = value.user.uid;
			await database().ref('users').child(uid).once('value')
			.then((snapshot)=>{
				let data = {
					uid: uid,
					nome: snapshot.val().nome,
					email: value.user.email,
					urlPerfil: snapshot.val().urlPerfil,
					fileNamePerfil: snapshot.val().fileNamePerfil,
					location: snapshot.val().location,
				}

				setUser(data);
				storageUser(data);
			})
		})
		.catch((error)=>{
			alert(error.code);
		});
	}

	//CADASTRAR USUÁRIO NO FIREBASE
	async function signUp(email, password, nome){
		await auth()
		.createUserWithEmailAndPassword(email, password)
		.then(async (value) => {
			
			let uid = value.user.uid;
			await database().ref('users').child(uid).set({
				uid: uid,
				nome: nome,
				urlPerfil: '',
				fileNamePerfil: '',
				location: ''
			})
			.then(()=>{
				let data = {
					uid: uid,
					nome: nome,
					email: value.user.email,
					urlPerfil: undefined,
					fileNamePerfil: undefined,
					location: undefined
				}

				setUser(data);
				storageUser(data);
			})

			console.log('Criado com sucesso');
		})
		.catch(error => {
			if (error.code === 'auth/email-already-in-use') {

			}

			if (error.code === 'auth/invalid-email') {

			}

			console.error(error);
		});
	}

	//AsyncStorage Grava localmente as informações do usuário logado
	async function storageUser(data){
		await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
	}

	//LOGOUT DO SISTEMA
	async function signOut(){
		await auth().signOut();
		await AsyncStorage.clear()
		.then(()=>{
			setUser(null);
		})
	}

	//UPLOAD FOTO
	async function uploadPhoto(fileName, uri){
		
		try{
			//verifica se o usuário ja possui foto
			if(user.urlPerfil !== undefined && user.urlPerfil !== ''){
				let string = user.uid + '/' + user.fileNamePerfil
				
				let storageRef = storage().ref('users').child(string);
				await storageRef.delete()
			}

			//upload storage
			let caminho = storage().ref(`users/${user.uid}/${fileName}`)
			await caminho.putFile(uri);

			//pega o link da imagem no storage e salva no database na propriedade do user urlPerfil, o nome salva no fileNamePerfil
			let url = await caminho.getDownloadURL();
			await database().ref('users').child(user.uid).update({
				urlPerfil: url,
				fileNamePerfil: fileName
			});

			//faz um snapshot do banco e cria um data para atualizar o state e o storage
			let snapshot = await database().ref('users').child(user.uid).once('value');
			let data = {
				uid: snapshot.val().uid,
				nome: snapshot.val().nome,
				email: snapshot.val().email,
				urlPerfil: snapshot.val().urlPerfil,
				fileNamePerfil: snapshot.val().fileNamePerfil,
				location: snapshot.val().location,
				
			};
			setUser(data);
			storageUser(data);

		} catch(error){ 
			
		}


	}

	//CADASTRAR LIVRO
	// nome,autor,editora,genero,descricao,images, fileName
	async function cadastrarLivro(dados, dadosLocation){
		//cadastra o book no database
		let referencia = database().ref(`books/${user.uid}`)
		let chaveRef = referencia.push();
		let chaveKey = chaveRef.key;
		await chaveRef.set(dados)
	    
		//faz upload da imagem no storage depois atualiza o database com o link público da imagem
		let chaveArmazenamentoRef = storage().ref(`books/${user.uid}/${chaveKey}`); 
		await dados.images.forEach(async (element, index) => {
		  let imagemChaveRef = chaveArmazenamentoRef.child(`${dados.fileName[index]}`);
		  await imagemChaveRef.putFile(element);
		  let downloadURL = await imagemChaveRef.getDownloadURL();
		  await database().ref(`books/${user.uid}/${chaveKey}/images/${index}`).set(downloadURL);
		});

		//insere location no user
		let refLocation = database().ref(`users/${user.uid}/location`);
		refLocation.set({
			latitude: dadosLocation.latitude,
			longitude: dadosLocation.longitude
		});

		
	}

	//LISTA usuarios com book dentro
	async function montaListaParaLocalizacao(){
		let snapshotBooks = await database().ref('books').once('value');
		let booksVal = snapshotBooks.val();

		let snapshotUsers = await database().ref('users').once('value');
		let objSnapshotUsers = snapshotUsers.val();

		const newObjSnapshotUsers = {};
		for (const [uid, userInList] of Object.entries(objSnapshotUsers)) {
			
			if (booksVal[uid] && uid != user.uid) {
				newObjSnapshotUsers[uid] = Object.assign({}, userInList, { books: booksVal[uid] });
			}
		}
		setUserWithBooks(newObjSnapshotUsers);
	}

	//LISTA os chats do User
	async function listarTodosChatsDoUser(setChats){
		database().ref(`chatsUsers/${user.uid}/chats`).on('value', (snapshot) => {
			if (snapshot.exists() && snapshot.val() !== null) {
				let chats = [];
				snapshot.forEach((childSnapshot) => {
					let chat = childSnapshot.val();
					chats.push(chat);
				});
				

				for (let i = 0; i < chats.length; i++) {
					const messages = chats[i].messages;
					const newMessages = [];
				  
					// Loop para percorrer cada chave-valor dentro de "messages"
					for (const key in messages) {
					  if (messages.hasOwnProperty(key)) {
						const message = messages[key];
						const newMessage = {
						  id: message.id,
						  content: message.content,
						  sent: message.sent,
						  sentBy: message.sentBy
						};
						newMessages.push(newMessage);
					  }
					}
				  
					chats[i].messages = newMessages;
				  }
				
				

				setChats(chats)
			} else {
				

				setChats([]);
			}

		})
	}

	//LISTA um chat do User com o contatoId
	async function listaUmChatDoUser(contatoId, setChat){
		let snapshot = await database().ref(`chatsUsers/${user.uid}/chats`).once('value')
		let chats = snapshot.val();

		let chatFound = null;
		let chatIdFound = null;
		for (let chatId in chats) {
			if (chats.hasOwnProperty(chatId)) {
			  let chat = chats[chatId];
			  let users = chat.users;
			  let foundUser = users.find(user => user.id === contatoId);
			  if (foundUser) {
				chatIdFound = chatId;
				chatFound = chat;
				break;
			  }
			}
		}
	
		database().ref(`chatsUsers/${user.uid}/chats/${chatIdFound}`).on('value', async (snapshot) => {
			if (snapshot.exists() && snapshot.val() !== null) {
				setChat(snapshot.val());
			} else {
				setChat(null);
			}
		})

	}

	async function sendMessage(data, contatoId, setFirstChat){
		
		let snapshotChats = await database().ref(`chatsUsers/${user.uid}/chats`).once('value')

		if(snapshotChats.exists() && snapshotChats.val() !== null){
			let chats = snapshotChats.val();
			let chatFound = null;
			let chatIdFound = null;
			for (let chatId in chats) {
				if (chats.hasOwnProperty(chatId)) {
					let chat = chats[chatId];
					let users = chat.users;
					let foundUser = users.find(user => user.id === contatoId);
					if (foundUser) {
						chatIdFound = chatId;
						chatFound = chat;
						break;
					}
				}
			}

			if(chatFound){
				let messageRef = database().ref(`chatsUsers/${user.uid}/chats/${chatIdFound}/messages`).push()
				let messageKey = messageRef.key

				await messageRef.set({
					id: messageKey,
					content: data.content,
					sent: data.sent,
					sentBy: data.sentBy
				});
				
				let messageOtherUser = database().ref(`chatsUsers/${contatoId}/chats/${chatIdFound}/messages/${messageKey}`)

				await messageOtherUser.set({
					id: messageKey,
					content: data.content,
					sent: data.sent,
					sentBy: data.sentBy
				})

			}else{
				let userNameSnapshotExists = await database().ref(`users/${contatoId}/nome`).once('value');
				let userNameExists = userNameSnapshotExists.val();
	
				let newChatRefExists = database().ref(`chatsUsers/${user.uid}/chats`).push();
				let newChatKeyExists = newChatRefExists.key;

				await newChatRefExists.set({
					id: newChatKeyExists,
					users:[
					{
						id: user.uid,
						phone: user.nome
					},
					{
						id: contatoId,
						phone: userNameExists
					}
					]
				});

				let newMessageRefExists = database().ref(`chatsUsers/${user.uid}/chats/${newChatKeyExists}/messages`).push();
				let newMessageKeyExists = newMessageRefExists.key

				await newMessageRefExists.set({
					id: newMessageKeyExists,
					content: data.content,
					sent: data.sent,
					sentBy: data.sentBy
				})

				//Atualizar segundo contato
				let newChatContatoIdRefExists = database().ref(`chatsUsers/${contatoId}/chats/${newChatKeyExists}`);
				await newChatContatoIdRefExists.set({
					id: newChatKeyExists,
					users: [
						{
							id: contatoId,
							phone: userNameExists
						},
						{
							id: user.uid,
							phone: user.nome
						}
					]
				});

				let newMessageContatoIdRefExists = database().ref(`chatsUsers/${contatoId}/chats/${newChatKeyExists}/messages/${newMessageKeyExists}`);
				await newMessageContatoIdRefExists.set({
					id: newMessageKeyExists,
					content: data.content,
					sent: data.sent,
					sentBy: data.sentBy
				})
				setFirstChat('new')
			}
		} else {

			let userNameSnapshot = await database().ref(`users/${contatoId}/nome`).once('value');
			let userNameContatoId = userNameSnapshot.val();

			let newChatRef = database().ref(`chatsUsers/${user.uid}/chats`).push();
			let newChatKey = newChatRef.key;

			await newChatRef.set({
				id: newChatKey,
				users:[
					{
						id: user.uid,
						phone: user.nome
					},
					{
						id: contatoId,
						phone: userNameContatoId
					}
					]
			})

			let newMessageRef = database().ref(`chatsUsers/${user.uid}/chats/${newChatKey}/messages`).push();
			let newMessageRefKey = newMessageRef.key

			await newMessageRef.set({
				id: newMessageRefKey,
				content: data.content,
				sent: data.sent,
				sentBy: data.sentBy
			});

			//Atualizar o segundo contato
			let newChatContatoIdRef = database().ref(`chatsUsers/${contatoId}/chats/${newChatKey}`);
			await newChatContatoIdRef.set({
				id: newChatKey,
				users: [
					{
						id: contatoId,
						phone: userNameContatoId
					},
					{
						id: user.uid,
						phone: user.nome
					}
				]
			});

			let newMessageContatoIdRef = database().ref(`chatsUsers/${contatoId}/chats/${newChatKey}/messages/${newMessageRefKey}`)
			await newMessageContatoIdRef.set({
				id: newMessageRefKey,
				content: data.content,
				sent: data.sent,
				sentBy: data.sentBy
			})
			setFirstChat('new')
		}
	}


 return (
		<AuthContext.Provider value={{
			signed: !!user, user, loading, userWithBooks, signUp, signIn, signOut, uploadPhoto, cadastrarLivro, montaListaParaLocalizacao, listarTodosChatsDoUser, listaUmChatDoUser, sendMessage
			}}>
			{children}
		</AuthContext.Provider>
  );
}