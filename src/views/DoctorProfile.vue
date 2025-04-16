<template>
  <div class="doctor-profile">
    <h1>Профиль врача</h1>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="doctor">
      <p><strong>Имя:</strong> {{ doctor.doctorName }}</p>
      <p><strong>Email:</strong> {{ doctor.email }}</p>
      <p><strong>Специализация:</strong> {{ doctor.speciality.speciality }}</p>
      <p><strong>Стаж:</strong> {{ doctor.speciality.experience }} лет</p>

      <div class="appointments">
        <h2>Записи к вам</h2>
        <ul v-if="appointments.length">
          <li
            v-for="apt in appointments"
            :key="apt._id || apt.id"
            class="appointment-item"
          >
            <p><strong>Пациент ID:</strong> {{ apt.patientId }}</p>
            <p><strong>Время приёма:</strong> {{ formatDate(apt.appointmentTime) }}</p>
          </li>
        </ul>
        <p v-else>У вас пока нет записей.</p>
      </div>
    </div>
    <div v-else>
      <p>Профиль не найден.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL =
  process.env.VUE_APP_API_URL ||
  'https://clinic-system-amwk.onrender.com'

const api = axios.create({ baseURL: API_URL })

export default {
  name: 'DoctorProfile',
  data() {
    return {
      doctor: null,
      appointments: [],
      loading: false,
      error: ''
    }
  },
  async mounted() {
    this.loading = true
    const token = localStorage.getItem('token')
    const doctorId = localStorage.getItem('doctorId')

    if (!token || !doctorId) {
      this.error = 'Необходимо выполнить вход как врач.'
      this.loading = false
      return
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    try {
      const { data: allDoctors } = await api.get('/doctor')
      this.doctor = allDoctors.find(
        d => (d._id || d.id) === doctorId
      )
      if (!this.doctor) {
        this.error = 'Врач не найден'
        this.loading = false
        return
      }
    } catch (err) {
      console.error('Ошибка загрузки списка врачей:', err)
      this.error = 'Не удалось загрузить профиль врача'
      this.loading = false
      return
    }

    try {
      const { data: all } = await api.get('/appointment')
      this.appointments = Array.isArray(all)
        ? all.filter(a => (a.doctorId === doctorId))
        : []
    } catch (err) {
      console.error('Ошибка загрузки записей:', err)
      this.appointments = []
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatDate(dt) {
      return new Date(dt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.doctor-profile {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.loading {
  font-style: italic;
  color: #555;
}
.error {
  color: red;
  font-weight: bold;
  margin-bottom: 1rem;
}
.appointments {
  margin-top: 1.5rem;
}
.appointment-item {
  border: 1px solid #ccc;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  text-align: left;
}
</style>
