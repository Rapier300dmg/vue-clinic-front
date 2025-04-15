<template>
  <div class="home">
    <h1 v-if="!isDoctor">Наши врачи</h1>
    <h1 v-else>Ваши пациенты</h1>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div v-if="isDoctor" class="patients-list">
        <div v-if="patients.length">
          <div
            v-for="patient in patients"
            :key="patient._id || patient.id"
            class="patient-card"
          >
            <p>
              <strong>Пациент:</strong>
              {{ patient.firstName }} {{ patient.lastName }}
            </p>
            <p><strong>Email:</strong> {{ patient.email }}</p>
          </div>
        </div>
        <p v-else>У вас пока нет записей.</p>
      </div>

      <div v-else class="doctors-list">
        <DoctorCard
          v-for="doctor in doctors"
          :key="doctor._id || doctor.id"
          :doctor="doctor"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DoctorCard from '@/components/DoctorCard.vue'

const API_URL =
  process.env.VUE_APP_API_URL ||
  'https://clinic-system-amwk.onrender.com'
const api = axios.create({ baseURL: API_URL })

export default {
  name: 'HomePage',
  components: { DoctorCard },
  data() {
    return {
      doctors: [],
      patients: [],
      error: ''
    }
  },
  computed: {
    isDoctor() {
      return localStorage.getItem('role') === 'doctor'
    },
    doctorId() {
      return localStorage.getItem('doctorId')
    },
    token() {
      return localStorage.getItem('token')
    }
  },
  async created() {
    if (this.isDoctor) {
      await this.fetchPatients()
    } else {
      await this.fetchDoctors()
    }
  },
  methods: {
    async fetchDoctors() {
      this.error = ''
      if (!this.token) {
        this.error = 'Пожалуйста, войдите, чтобы посмотреть список врачей.'
        return
      }
      try {
        api.defaults.headers.common.Authorization = `Bearer ${this.token}`
        const res = await api.get('/doctor')
        this.doctors = Array.isArray(res.data) ? res.data : []
      } catch (err) {
        console.error('Ошибка загрузки врачей:', err)
        this.error =
          err.response?.data?.message ||
          'Не удалось загрузить список врачей.'
      }
    },

    async fetchPatients() {
      this.error = ''
      if (!this.token || !this.doctorId) {
        this.error = 'Требуется авторизация как врач.'
        return
      }
      api.defaults.headers.common.Authorization = `Bearer ${this.token}`

      let appointments = []
      try {
        const res = await api.get(`/appointment/doctor/${this.doctorId}`)
        appointments = Array.isArray(res.data) ? res.data : [res.data]
      } catch (err) {
        if (err.response?.status === 404) {
          appointments = []
        } else {
          console.error('Ошибка загрузки записей:', err)
          this.error =
            err.response?.data?.message ||
            'Не удалось загрузить список записей.'
          return
        }
      }

      if (!appointments.length) {
        this.patients = []
        return
      }

      const uniqueIds = [
        ...new Set(appointments.map(a => a.patientId).filter(Boolean))
      ]

      const patients = []
      for (const pid of uniqueIds) {
        try {
          const r = await api.get(`/user/${pid}`)
          patients.push(r.data)
        } catch (err) {
          console.warn(`Не удалось загрузить профиль пациента ${pid}`, err)
        }
      }
      this.patients = patients
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 1rem;
}

.doctors-list,
.patients-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.patient-card {
  background: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: left;
}

.error {
  color: red;
  margin: 1rem 0;
}
</style>
