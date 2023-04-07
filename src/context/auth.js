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
				}
				console.log('Info usuario logado:')
				console.log(data)
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
			console.log('CHEGOU AQUI')
			let uid = value.user.uid;
			await database().ref('users').child(uid).set({
				uid: uid,
				nome: nome,
				urlPerfil: '',
				fileNamePerfil: ''
			})
			.then(()=>{
				let data = {
					uid: uid,
					nome: nome,
					email: value.user.email,
					urlPerfil: undefined,
					fileNamePerfil: undefined
				}
				console.log(data);
				setUser(data);
				storageUser(data);
			})

			console.log('Criado com sucesso');
		})
		.catch(error => {
			if (error.code === 'auth/email-already-in-use') {
				console.log('Esse email já está em uso');
			}

			if (error.code === 'auth/invalid-email') {
				console.log('Esse email é inválido');
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
				console.log('stringgggg:', string)
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
				
			};
			setUser(data);
			storageUser(data);

		} catch(error){ 
			console.log('Erro ao carregar a foto:', error);
		}


	}

	//CADASTRAR LIVRO
	async function cadastrarLivro(){
		
	}

 return (
		<AuthContext.Provider value={{
			signed: !!user, user, loading, signUp, signIn, signOut, uploadPhoto
			}}>
			{children}
		</AuthContext.Provider>
  );
}