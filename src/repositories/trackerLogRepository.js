const TrackerLog = require('../models/trackerLog');

class TrackerLogRepository {
  async create(logData) {
    return await TrackerLog.create(logData);
  }

  async bulkCreate(logsData) {
    return await TrackerLog.insertMany(logsData);
  }

  async findWithPagination(query, skip, limit) {
    console.log("findWithPagination",query,skip,limit);
    
    var result = await TrackerLog.find(query)
    .populate({
      path: "track",
      model: "Tracks",
      select: "-__v -createdAt -updatedAt",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();;
    console.log(result);
    return result;
  }

  async countDocuments(query) {
    return await TrackerLog.countDocuments(query);
  }

  async findExistingTrackLogs(trackIds) {
    return await TrackerLog.find({ track: { $in: trackIds } })
      .select('Tracks')
      .lean();
  }
}

module.exports = new TrackerLogRepository(); 