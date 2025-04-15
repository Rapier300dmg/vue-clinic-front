<template>
  <nav class="navbar">
    <router-link to="/" class="nav-logo">МедСистема</router-link>
    <div class="menu-icon" @click="toggleMenu">
      <span v-if="!isMenuOpen">&#9776;</span>
      <span v-else>&times;</span>
    </div>
    <div :class="['nav-links', { open: isMenuOpen }]">
      <router-link to="/">Главная</router-link>

      <router-link
        v-if="isAuthenticated && userRole !== 'doctor'"
        to="/appointment"
      >
        Записаться к врачу
      </router-link>

      <router-link
        v-if="isAuthenticated"
        :to="{ name: 'AppointmentList' }">
        Ваши записи
      </router-link>


      <router-link v-if="!isAuthenticated" to="/login">Войти</router-link>
      <router-link v-if="!isAuthenticated" to="/register">Регистрация</router-link>

      <router-link
        v-if="isAuthenticated"
        :to="userRole === 'doctor' ? '/doctor-profile' : '/profile'"
      >
        Профиль
      </router-link>

      <button
        v-if="isAuthenticated"
        @click="logout"
        class="btn-logout"
      >
        Выход
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MainNavbar',
  data() {
    return { isMenuOpen: false }
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token')
    },
    userRole() {
      return localStorage.getItem('role')
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('doctorId')
      this.$router.push({ name: 'Home' })
        .then(() => window.location.reload())
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #007bff;
  padding: 1rem 2rem;
  position: relative;
}
.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}
.menu-icon {
  display: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
}
.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.nav-links a,
.nav-links button {
  color: #fff;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.btn-logout {
  padding: 0;
}
@media (max-width: 768px) {
  .menu-icon { display: block; }
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #007bff;
    flex-direction: column;
    display: none;
    padding: 1rem 0;
    z-index: 100;
  }
  .nav-links.open { display: flex; }
  .nav-links a,
  .nav-links button {
    padding: 0.5rem 1rem;
    width: 100%;
    text-align: center;
  }
}
</style>
