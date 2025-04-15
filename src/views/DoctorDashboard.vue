<template>
    <div class="doctor-dashboard">
      <h1>доктор!</h1>
      <p>Это ваша панель управления. Здесь можно добавить функции, специфичные для докторов:</p>
      <ul>
        <li>Просмотр списка назначений</li>
        <li>Редактирование профиля</li>
        <li>Просмотр статистики</li>
      </ul>
      <p>Обратите внимание: в этом разделе нет возможности записываться на прием, так как эта функция предназначена только для пациентов и менеджера.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DoctorDashboard',
    data() {
      return {
      }
    },
    mounted() {
    }
  }
  </script>
  
  <style scoped>
  .doctor-dashboard {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    background: #f9f9f9;
    border-radius: 8px;
  }
  .doctor-dashboard h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  </style>
  