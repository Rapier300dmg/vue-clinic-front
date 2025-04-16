<template>
  <div class="profile-container" v-if="user">
    <h2>Профиль пользователя</h2>
    <p><strong>Имя:</strong> {{ user.firstName }} {{ user.lastName }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Возраст:</strong> {{ user.age }}</p>
  </div>
  <div v-else-if="error" class="error">
    <p>{{ error }}</p>
  </div>
  <div v-else class="loading">
    <p>Загрузка профиля...</p>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UserProfilePage',
  data() {
    return {
      user: null,
      error: ''
    }
  },
  async created() {
    await this.fetchUser()
  },
  methods: {
    async fetchUser() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Пользователь не авторизован')
        }
        const response = await axios.get(
          `https://clinic-system-amwk.onrender.com/user/me?nocache=${Date.now()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )
        this.user = response.data
      } catch (err) {
        console.error('Ошибка при загрузке профиля:', err)
        this.error = err.response?.data?.message || err.message || 'Ошибка загрузки профиля'
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  color: black;
}
.error {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  color: red;
  text-align: center;
}
.loading {
  text-align: center;
  margin-top: 2rem;
}
</style>
