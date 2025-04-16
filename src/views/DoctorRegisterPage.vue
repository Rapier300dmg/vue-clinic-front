<template>
  <div class="form-container">
    <h2>Регистрация врача</h2>
    <form @submit.prevent="handleDoctorRegister">
      <input v-model="doctorName" type="text" placeholder="Имя и фамилия" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <input v-model="confirmPassword" type="password" placeholder="Подтвердите пароль" required />
      <div class="speciality-group">
        <input v-model="speciality" type="text" placeholder="Специализация" required />
        <input v-model.number="experience" type="number" placeholder="Стаж (лет)" min="0" required />
      </div>
      <button type="submit">Зарегистрироваться</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://clinic-system-amwk.onrender.com'
})

export default {
  name: 'DoctorRegisterPage',
  data() {
    return {
      doctorName: '',
      email: '',
      password: '',
      confirmPassword: '',
      speciality: '',
      experience: null,
      error: ''
    }
  },
  methods: {
    async handleDoctorRegister() {
      this.error = ''
      if (this.password !== this.confirmPassword) {
        this.error = 'Пароли не совпадают'
        return
      }

      try {
        await api.post('/auth/register/doctor', {
          doctorName: this.doctorName,
          email: this.email,
          password: this.password,
          speciality: {
            speciality: this.speciality,
            experience: this.experience
          }
        })
        await this.$router.push({
          name: 'Login',
          query: { role: 'doctor' }
        })
        window.location.reload()
      } catch (err) {
        console.error('Ошибка регистрации врача:', err)
        if (err.response) {
          if (err.response.status === 409) {
            this.error = 'Врач с таким email уже зарегистрирован'
          } else {
            this.error = err.response.data.message || 'Ошибка регистрации врача'
          }
        } else {
          this.error = 'Не удалось подключиться к серверу'
        }
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 3rem auto;
  padding: 3rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}
input, button {
  width: 100%;
  margin: 1rem 0;
  padding: 0.8rem;
  font-size: 1rem;
}
button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #0069d9;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
