import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import UserRegister from '@/views/UserRegister.vue'
import UserLoginPage from '@/views/UserLoginPage.vue'
import DoctorsList from '@/views/DoctorsList.vue'
import DoctorDetails from '@/views/DoctorDetails.vue'
import DoctorRegisterPage from '@/views/DoctorRegisterPage.vue'
import DoctorProfile from '@/views/DoctorProfile.vue'
import DoctorDashboard from '@/views/DoctorDashboard.vue'
import Files from '@/views/Files.vue'
import Profile from '@/views/Profile.vue'
import Appointment from '@/views/Appointment.vue'
import AppointmentButton from '@/components/AppointmentButton.vue'
import AppointmentList from '@/components/AppointmentList.vue'
import NotFoundPage from '@/views/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },

  { path: '/register', name: 'Register', component: UserRegister },
  { path: '/register/doctor', name: 'DoctorRegister', component: DoctorRegisterPage },
  { path: '/login', name: 'Login', component: UserLoginPage },

  { path: '/doctors', name: 'DoctorsList', component: DoctorsList },
  { path: '/doctors/:id', name: 'DoctorDetails', component: DoctorDetails, props: true },

  { path: '/doctor-profile', name: 'DoctorProfile', component: DoctorProfile },
  { path: '/doctor-dashboard', name: 'DoctorDashboard', component: DoctorDashboard },

  { path: '/files', name: 'Files', component: Files },
  { path: '/profile', name: 'Profile', component: Profile },

  { path: '/appointment', name: 'Appointment', component: Appointment },
  {
    path: '/appointment/:doctorId',
    name: 'AppointmentBook',
    component: AppointmentButton,
    props: true
  },

  // единственный маршрут для списка и деталей записей
  {
    path: '/appointment-list/:appointmentId?',
    name: 'AppointmentList',
    component: AppointmentList,
    props: true
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
