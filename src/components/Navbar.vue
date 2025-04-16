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
        :to="{ name: 'AppointmentList' }"
      >
        Ваши записи
      </router-link>

      <router-link
        v-if="!isAuthenticated"
        to="/login"
      >
        Войти
      </router-link>
      <router-link
        v-if="!isAuthenticated"
        to="/register"
      >
        Регистрация
      </router-link>

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
    return {
      isMenuOpen: false
    }
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
:root {
  --primary-color: #007bff;
  --nav-text-color: #f0f0f0;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-color);
  padding: 1rem 2rem;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.nav-logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--nav-text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.menu-icon {
  display: none;
  font-size: 2.5rem;
  color: var(--nav-text-color);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a,
.nav-links button {
  color: var(--nav-text-color);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.nav-links a:hover,
.nav-links button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-logout {
  padding: 0.5rem 0.8rem;
}

@media (max-width: 768px) {
  .menu-icon {
    display: block;
  }
  
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-color);
    flex-direction: column;
    align-items: center;
    display: none;
    padding: 1rem 0;
    z-index: 100;
    transition: max-height 0.3s ease-in-out;
    overflow: hidden;
  }
  
  .nav-links.open {
    display: flex;
  }
  
  .nav-links a,
  .nav-links button {
    width: 100%;
    text-align: center;
  }
}
</style>
