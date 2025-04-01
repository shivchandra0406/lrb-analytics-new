const Track = require("../models/track");
const Tracks = require('../models/track');

class TrackRepository {
  // Get all tracks without the version field
  async getAllTracks(filter) {
    const actions = await Track.find(filter)
      .populate({
        path: "featureId",
        model: "Features",
        select: "-__v -createdAt -updatedAt",
      })
      .populate({
        path: "actionId",
        model: "Actions",
        select: "-__v -createdAt -updatedAt",
      }).lean()
      .select("-__v");
      return actions;
  }
   
  // Get a single track by its ID
  async getTrackById(id) {
    return await Track.findById(id).select("-__v");
  }

  // Save a new track
  async saveTrackAsync(data) {
    const track = new Track(data);  // Create an instance of Track model
    return await track.save();  // Save the instance
  }

  // Update an existing track by filter and update data
  async updateTrackAsync(filter, data) {
    return await Track.updateOne(filter, { $set: data });  // Use $set to update fields
  }

  // Delete a track by ID
  async deleteTrackAsync(id) {
    return await Track.deleteOne({ _id: id });
  }

  // Get tracks by user ID
  async getTracksByUserId(userId) {
    return await Track.find({ UserId: userId }).select("-__v");
  }

  async findAll() {
    return await Tracks.find().populate('featureId');
  }

  async findByIds(trackIds) {
    return await Tracks.find({ _id: { $in: trackIds } }).populate('featureId');
  }

  async getAllTrackIds(currentPage,pageSize) {
    // Only fetch IDs to save memory
    return await Track.find({}, '_id').lean();
  }

  async findByIdsWithFeature(trackIds) {
    return await Track.find({ _id: { $in: trackIds } })
      .populate('featureId')
      .lean();
  }

  async countAll() {
    return await Track.countDocuments();
  }

  async findPaginated(skip, limit) {
    return await Track.find({})
      .select('_id')
      .skip(skip)
      .limit(limit)
      .lean();
  }
}

module.exports = new TrackRepository();
