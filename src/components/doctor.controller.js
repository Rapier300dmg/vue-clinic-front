const Doctor = require('../models/doctor.model')

exports.createDoctor = async (req, res) => {
  try {
    const doc = new Doctor(req.body)
    await doc.save()
    res.status(201).json(doc)
  } catch (err) {
    console.error('createDoctor:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
    res.json(doctors)
  } catch (err) {
    console.error('getAllDoctors:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.getDoctorById = async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doc)
  } catch (err) {
    console.error('getDoctorById:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.updateDoctorById = async (req, res) => {
  try {
    const doc = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!doc) return res.status(404).json({ message: 'Doctor not found' })
    res.json(doc)
  } catch (err) {
    console.error('updateDoctorById:', err)
    res.status(500).json({ message: err.message })
  }
}

exports.deleteDoctorById = async (req, res) => {
  try {
    const doc = await Doctor.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Doctor not found' })
    res.json({ message: 'Doctor deleted' })
  } catch (err) {
    console.error('deleteDoctorById:', err)
    res.status(500).json({ message: err.message })
  }
}
