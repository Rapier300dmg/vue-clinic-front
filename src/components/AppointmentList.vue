<!-- src/components/AppointmentList.vue -->
<template>
  <div class="appointments-list">
    <h1 v-if="!appointmentId">Ваши записи</h1>
    <h1 v-else>Детали записи</h1>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else>
      <ul v-if="appointments.length">
        <li
          v-for="apt in appointments"
          :key="apt._id || apt.id"
          class="appointment-item"
        >
          <p><strong>Врач:</strong> {{ apt.doctorId }}</p>
          <p><strong>Дата и время:</strong> {{ formatDate(apt.appointmentTime) }}</p>
          <p v-if="apt.patientId"><strong>ID пациента:</strong> {{ apt.patientId }}</p>
        </li>
      </ul>
      <p v-else>Записи не найдены.</p>
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
  name: 'AppointmentList',
  props: {
    appointmentId: { type: String, default: null }
  },
  data() {
    return {
      appointments: [],
      error: ''
    }
  },
  async created() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.error = 'Пользователь не авторизован'
      return
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    const role = localStorage.getItem('role')
    const idKey = role === 'doctor' ? 'doctorId' : 'userId'
    const id = localStorage.getItem(idKey)
    if (!id) {
      this.error = 'Не удалось определить идентификатор'
      return
    }

    try {
      // 1) Если есть appointmentId — детали одной записи
      if (this.appointmentId) {
        const res = await api.get(`/appointment/${this.appointmentId}`)
        this.appointments = [res.data]
        return
      }

      // 2) Если доктор — список его записей
      if (role === 'doctor') {
        try {
          const res = await api.get(`/appointment/doctor/${id}`)
          this.appointments = Array.isArray(res.data) ? res.data : [res.data]
        } catch (err) {
          // 404/403 — пустой список
          this.appointments = []
        }
        return
      }

      // 3) Пациент — список его записей через /appointment/patient/:id
      try {
        const res = await api.get(`/appointment/patient/${id}`)
        this.appointments = Array.isArray(res.data) ? res.data : [res.data]
      } catch (err) {
        // 404 или 403 — просто пустой список
        if (err.response?.status === 404 || err.response?.status === 403) {
          this.appointments = []
        } else {
          throw err
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки записей:', err)
      this.error =
        err.response?.data?.message || 'Ошибка загрузки записей'
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
.appointments-list {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
.error {
  color: red;
  text-align: center;
  margin: 1rem 0;
}
ul {
  list-style: none;
  padding: 0;
}
.appointment-item {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
</style>
