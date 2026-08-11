const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    status: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed'] },
    dueDate: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)
