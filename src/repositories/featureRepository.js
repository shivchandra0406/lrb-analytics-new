const Features = require('../models/feature');

class FeatureRepository {
  // Get all features without the version field
  async getAllAsync() {
    return await Features.find().select("-__v");
  }

  // Get a single feature by its ID
  async getByIdAsync(id) {
    return await Features.findById(id).select("-__v");
  }

  // Save a new feature
  async saveAsync(data) {
    const feature = new Features(data);  // Create an instance of Features
    return await feature.save();  // Save the instance
  }

  // Update an existing feature by filter and update data
  async updateAsync(filter, data) {
    return await Features.updateOne(filter, { $set: data });  // Use $set to update fields
  }

  // Delete a feature by ID
  async deleteAsync(id) {
    return await Features.deleteOne({ _id: id });
  }

  async findById(id) {
    return await Features.findById(id);
  }
}

module.exports = new FeatureRepository();
