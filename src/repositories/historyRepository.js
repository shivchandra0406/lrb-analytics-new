const HistoryModel = require("../models/histories");

class HistoryRepository {
  // Get all features without the version field
  async getAllAsync(filter) {
    return await HistoryModel.find(filter).select("-__v");
  }

  // Get a single feature by its ID
  async getByIdAsync(id) {
    return await HistoryModel.findById(id).select("-__v");
  }
  async getByFilterAsync(filter) {
    console.log("Filter:", JSON.stringify(filter));
    // Query MongoDB with tenantId and resource
    return await HistoryModel.find(filter).select("-__v");
  }
  
  // Save a new feature
  async saveAsync(data) {
    const log = new HistoryModel(data);  // Create an instance of FeatureModel
    return await log.save();  // Save the instance
  }

  // Update an existing feature by filter and update data
  async updateAsync(filter, data) {
    return await HistoryModel.findOneAndUpdate(filter, { $set: data });  // Use $set to update fields
  }

  // Delete a feature by ID
  async deleteAsync(id) {
    return await HistoryModel.deleteOne({ _id: id });
  }
}

module.exports = new HistoryRepository();
