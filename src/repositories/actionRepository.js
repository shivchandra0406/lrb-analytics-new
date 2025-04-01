const ActionModel = require("../models/action");

class ActionRepository {
  // Get all actions without the version field
  async getAllActionAsync() {
    return await ActionModel.find()
      .select("-__v")
      .populate({
        path: "featureId",
        model: "Features",
        select: "-__v -createdAt -updatedAt", // Exclude unnecessary fields
      })
      .lean() // Converts Mongoose document to plain object
      .then(actions =>
        actions.map(action => ({
          ...action,
          Features: action.featureId, // Rename featureId to Features
          featureId: undefined, // Remove original featureId field
        }))
      );
  }
  

  // Save a new action
  async saveActionAsync(data) {
    const action = new ActionModel(data);  // Create an instance of ActionModel
    return await action.save();  // Save the instance
  }

  // Update an existing action by filter and update data
  async updateActionAsync(filter, data) {
    return await ActionModel.updateOne(filter, { $set: data });  // Use $set to update fields
  }
}

module.exports = new ActionRepository();
