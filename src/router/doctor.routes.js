const express = require('express')
const router = express.Router()
const authUser = require('../middleware/authUser')      
const authManager = require('../middleware/authManager')
const doctorCtrl = require('../controllers/doctor.controller')

router.post('/', authUser, doctorCtrl.createDoctor)

router.get('/', authUser, doctorCtrl.getAllDoctors)

router.get('/:id', authUser, doctorCtrl.getDoctorById)

router.patch('/:id', authUser, doctorCtrl.updateDoctorById)

router.delete('/:id', authManager, doctorCtrl.deleteDoctorById)

module.exports = router
