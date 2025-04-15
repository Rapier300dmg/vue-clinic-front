<template>
  <div class="appointment-page">
    <h1>Запись к врачу</h1>

    <div v-if="!isAuthenticated" class="not-auth">
      <p>Пожалуйста, войдите, чтобы записаться на приём.</p>
      <router-link to="/login" class="btn-login">Войти</router-link>
    </div>

    <div v-else>
      <div class="filter">
        <label for="spec">Специализация:</label>
        <select id="spec" v-model="selectedSpec">
          <option value="">Все</option>
          <option
            v-for="spec in specializations"
            :key="spec"
            :value="spec"
          >
            {{ spec }}
          </option>
        </select>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <div class="doctors-list">
        <div
          v-for="doctor in filteredDoctors"
          :key="doctor._id || doctor.id"
          class="doctor-item"
        >
          <DoctorCard :doctor="doctor" />
          <button
            class="btn-book"
            @click="goToBooking(doctor)"
          >
            Записаться
          </button>
        </div>
        <p v-if="!filteredDoctors.length && !error" class="no-results">
          Врачи с выбранной специализацией не найдены.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DoctorCard from '@/components/DoctorCard.vue'

export default {
  name: 'AppointmentPage',
  components: { DoctorCard },
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
      doctors: [],
      selectedSpec: '',
      error: ''
    }
  },
  computed: {
    specializations() {
      const specs = this.doctors
        .map(d => d.speciality?.speciality)
        .filter(Boolean)
      return Array.from(new Set(specs)).sort()
    },
    filteredDoctors() {
      if (!this.selectedSpec) {
        return this.doctors
      }
      return this.doctors.filter(
        d => d.speciality?.speciality === this.selectedSpec
      )
    }
  },
  async created() {
    if (!this.isAuthenticated) return

    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(
        'https://clinic-system-amwk.onrender.com/doctor',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      this.doctors = Array.isArray(res.data) ? res.data : []
    } catch (err) {
      console.error('Ошибка при загрузке врачей:', err)
      this.error = err.response?.data?.message || 'Не удалось загрузить врачей.'
    }
  },
  methods: {
    goToBooking(doctor) {
      const id = doctor._id || doctor.id
      if (id) {
        this.$router.push({
          name: 'AppointmentBook',
          params: { doctorId: id }
        })
      } else {
        console.warn('Не удалось получить ID врача для записи')
      }
    }
  }
}
</script>

<style scoped>
.appointment-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.appointment-page h1 {
  text-align: center;
  font-size: 2rem;
}

.filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.filter label {
  font-weight: bold;
}

.filter select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.doctors-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.doctor-item {
  background: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.btn-book {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  background: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-book:hover {
  background: #218838;
}

.not-auth {
  text-align: center;
}

.btn-login {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #007bff;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
}

.btn-login:hover {
  background: #0056b3;
}

.error {
  text-align: center;
  color: red;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  color: #555;
}

@media (max-width: 600px) {
  .filter {
    flex-direction: column;
    align-items: stretch;
  }
  .filter select {
    width: 100%;
  }
}

@media (max-width: 400px) {
  .appointment-page {
    padding: 0.5rem;
  }
  .appointment-page h1 {
    font-size: 1.5rem;
  }
  .btn-book {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  .btn-login {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
