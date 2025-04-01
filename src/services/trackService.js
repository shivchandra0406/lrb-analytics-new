const trackRepository = require("../repositories/trackRepository");

class TrackService {
  
  async getAllTracksAsync(req) {
    try {
      const { tenantId, userId, refId, featureId, actionId, fromDate, toDate } = req.query;
      let filter = {};

      if (tenantId) filter.tenantId = tenantId;
      if (userId) filter.userId = userId;
      if (refId) filter.refId = refId;
      if (featureId) filter.featureId = featureId;
      if (actionId) filter.actionId = actionId;

      if (fromDate || toDate) {
        filter.createdAt = {};
        // If fromDate is provided, add a $gte (greater-than-or-equal-to) filter
        if (fromDate) {
          const from = new Date(fromDate);
          if (!isNaN(from.getTime())) {
            filter.createdAt.$gte = from; 
          }
        }

        // If toDate is provided, add a $lte (less-than-or-equal-to) filter
        if (toDate) {
          const to = new Date(toDate);
          if (!isNaN(to.getTime())) {
            filter.createdAt.$lte = to;
          }
        }
        // Clean up createdAt if no valid dates are added
        if (Object.keys(filter.createdAt).length === 0) {
          delete filter.createdAt;
        }
      }
      const tracks = await trackRepository.getAllTracks(filter);
      return tracks.map((action) => ({
        ...action,
        feature: action.featureId, // Rename featureId to Features
        action: action.actionId,
        featureId: undefined, // Remove original featureId field
        actionId: undefined,
      }));

      return tracks;
    } catch (err) {
      throw err;
    }
  }

  async saveTracksAsync(data) {
    try {
      const tracks = await trackRepository.saveTrackAsync(data);
      return tracks;
    } catch (err) {
      throw err;
    }
  }
  async updateTracksAsync(filter) {
    try {
      const tracks = await trackRepository.updateTrackAsync(filter, data);
      return tracks;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new TrackService();
