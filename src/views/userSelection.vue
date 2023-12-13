<script setup lang="ts">
import useFirebase from '../composables/useFirebase.ts'
import { User } from '../interfaces/user.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'

const { push } = useRouter()
const { getUsers, addUser } = useFirebase()

const users = ref<User[]>([])

const newUserName = ref('')

const existingUser = useLocalStorage('user', '')

getUsers().then((data) => {
  users.value = data
})

const newUser = async () => {
  const newUser: User = {
    name: newUserName.value,
    mazeScore: 0,
    mazeShortestTime: -1,
  }
  addUser(newUser).then(() => {
    existingUser.value = newUser.name
    getUsers().then((data) => {
      users.value = data
    })
  })
}


const login = async () => {
  console.log('login')
  if (newUserName.value) {
    console.log('new user')
    newUser().then(() => {
      push('/')
    })
  } else if (existingUser.value) {
    console.log('existing user')
    await push('/')
  } else {
    console.log('no user')
  }
}


</script>

<template>
  <div class="container">

    <h1>
      Who's playing?
    </h1>
    <form @submit.prevent="login">

      <select :value="existingUser" @change="existingUser = $event.target.value">
        <option value="" disabled selected>Select user</option>
        <option :value="user.name" v-for="user of users" :id="user.name">
          {{ user.name }}
        </option>
      </select>
      <div class="or">
        or
      </div>

      <input type="text" v-model="newUserName" placeholder="new user">
      <button type="submit"> submit</button>
    </form>


  </div>

</template>

<style scoped>

div.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.container h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  background-color: #fff;
}

input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  background-color: #fff;
}

.or {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: bold;

}

button[type="submit"] {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  width: 100%;
  @apply bg-blue-500 text-white;
  cursor: pointer;
}

</style>