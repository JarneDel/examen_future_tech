// useFirebase.ts
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  DocumentData,
  QueryDocumentSnapshot,
  getDocs,
} from 'firebase/firestore'
import { Game } from '../interfaces/game.interface'
import { User } from '../interfaces/user.ts'
import { useLocalStorage } from '@vueuse/core'

// Initialize Firebase
const app = initializeApp({
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
})

const db = getFirestore(app)

const docRef = collection(db, 'games')
const userRef = collection(db, 'users')
const userId = useLocalStorage("userId", "")


const getUsers = async (): Promise<User[]> => {
  try {
    const users: User[] = []
    const querySnapshot = await getDocs(collection(db, 'users'))

    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      users.push(doc.data() as User )
    })

    console.log('Users: ', users)
    return users
  } catch (error) {
    console.error('Error getting users: ', error)
    throw error
  }
}

const addUser = async (user: User): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await addDoc(userRef, user)
      .then((res) => {
        console.log('User added')
        userId.value = res.id
        resolve()
      })
      .catch((error: Error): void => {
        console.error('Error adding user: ', error)
        reject(error)
      })
  })
}

const updateUser = async (game: Partial<User>): Promise<void> => {
  const gameRef = doc(db, 'games', userId.value)

  return updateDoc(gameRef, game)
    .then(() => {
      console.log('Game updated')
    })
    .catch((error: Error) => {
      console.error('Error updating game: ', error)
      throw error
    })
}




// Add game
const addGame = async (game: Game): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    await addDoc(docRef, game)
      .then(() => {
        console.log('Game added')
        resolve()
      })
      .catch((error: Error): void => {
        console.error('Error adding game: ', error)
        reject(error)
      })
  })
}

// All games
const allGames = (): Promise<Game[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const games: DocumentData[] = []
      const querySnapshot = await getDocs(collection(db, 'games'))

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        games.push(doc.data())
      })

      console.log('Games: ', games)
      resolve(games as Game[])
    } catch (error) {
      console.error('Error getting games: ', error)
      reject(error)
    }
  })
}

export default () => {
  return {
    addGame,
    allGames,
    getUsers,
    addUser,
    updateUser,
  }
}
