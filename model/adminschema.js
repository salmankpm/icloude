import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
  id:  { type: String},
  username:  { type: String, required: true },
  email:  { type: String, required: true },
  password: { type: String, required: true },
})

export const adminSchemaModels = mongoose.model('adminCollection', adminSchema)