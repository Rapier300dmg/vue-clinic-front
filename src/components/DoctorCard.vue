<template>
  <div class="doctor-card">
    <h2>{{ doctor.doctorName }}</h2>
    <p>{{ doctor.speciality.speciality }} ({{ doctor.speciality.experience }} лет стажа)</p>
  </div>
</template>

<script>
export default {
  name: 'DoctorCard',
  props: {
    doctor: {
      type: Object,
      required: true
    }
  }
}
</script>


<style scoped>
.doctor-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  text-align: center;
  width: 250px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  color: #000;
}
.doctor-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}
.btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
}
</style>
