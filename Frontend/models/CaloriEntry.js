const mongoose = require('mongoose');

const calorieEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References your User model
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true // Faster querying by date
  },
  meals: {
    breakfast: { type: Number, default: 0 },
    lunch: { type: Number, default: 0 },
    dinner: { type: Number, default: 0 },
    snacks: { type: Number, default: 0 }
  },
  water: {
    type: Number,
    default: 0 // in milliliters
  },
  nutrients: {
    protein: { type: Number, default: 0 }, // in grams
    carbs: { type: Number, default: 0 },    // in grams
    fats: { type: Number, default: 0 }      // in grams
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true } // Includes virtuals when converted to JSON
});

// Virtual for total calories
calorieEntrySchema.virtual('totalCalories').get(function() {
  return this.meals.breakfast + this.meals.lunch + 
         this.meals.dinner + this.meals.snacks;
});

// Index for frequently queried fields
calorieEntrySchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('CalorieEntry', calorieEntrySchema);