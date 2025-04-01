const trackerLogRepository = require("../repositories/trackerLogRepository");
const featureRepository = require("../repositories/featureRepository");
const trackRepository = require("../repositories/trackRepository");

class TrackerLogService {
  async createTrackerLog(trackId, featureId) {
    const feature = await featureRepository.findById(featureId);
    if (!feature) {
      throw new Error("Feature not found");
    }

    const parts = feature.featurePath.split(".");
    const logData = {
      track: trackId,
      source: parts[0] || null,
      feature: parts[1] || null,
      component: parts[2] || null,
      actionType: parts[3] || null,
      action: parts[4] || null,
    };

    return await trackerLogRepository.create(logData);
  }

  async getTrackerLogs(filters) {
    const {
      trackId,
      source,
      feature,
      component,
      actionType,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters.params;
    console.log(filters);

    // Build query
    const query = {};
    if (trackId) query.track = trackId;
    if (source) query.source = source;
    if (feature) query.feature = feature;
    if (component) query.component = component;
    if (actionType) query.actionType = actionType;
    if (action) query.action = action;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [trackerLogs, total] = await Promise.all([
      trackerLogRepository.findWithPagination(query, skip, parseInt(limit)),
      trackerLogRepository.countDocuments(query),
    ]);

    return {
      trackerLogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  async createBulkTrackerLogsWithPagination(
    trackIds,
    batchSize = 100,
    currentPage = 1
  ) {
    let totalCreated = 0;
    let totalSkipped = 0;
    const totalTracks = trackIds.length;

    try {
      // Calculate start and end index for pagination
      const startIndex = (currentPage - 1) * batchSize;
      const endIndex = Math.min(
        (startIndex + batchSize),
        totalTracks
      );

      // Extract batch based on pagination
      const batchTrackIds = trackIds.slice(startIndex, endIndex);

      if (!batchTrackIds.length) {
        return {
          created: 0,
          skipped: 0,
          total: totalTracks,
          message: `No more tracks to process on page ${currentPage}`,
          success: false,
        };
      }

      // Get batch of tracks with their features
      const tracks = await trackRepository.findByIds(batchTrackIds);
      if (!tracks.length) {
        return {
          created: 0,
          skipped: batchTrackIds.length,
          total: totalTracks,
          message: `No tracks found for page ${currentPage}`,
          success: false,
        };
      }

      // Find existing tracker logs for this batch
      const existingLogs = await trackerLogRepository.findExistingTrackLogs(
        batchTrackIds
      );
      const existingTrackIds = new Set(
        existingLogs.map((log) => log.track.toString())
      );

      // Filter out tracks that already have logs
      const newTracks = tracks.filter(
        (track) => !existingTrackIds.has(track._id.toString())
      );

      // Prepare bulk insert data
      const logsToCreate = newTracks.map((track) => {
        const parts = track.featureId?.name?.split(".") || [];
        return {
          track: track._id,
          source: parts[0] || null,
          feature: parts[1] || null,
          component: parts[2] || null,
          actionType: parts[3] || null,
          action: parts[4] || null,
        };
      });

      if (logsToCreate.length > 0) {
        await trackerLogRepository.bulkCreate(logsToCreate);
        totalCreated += logsToCreate.length;
      }

      totalSkipped += batchTrackIds.length - logsToCreate.length;

      return {
        created: totalCreated,
        skipped: totalSkipped,
        total: totalTracks,
        currentPage,
        message: `Tracker logs creation completed for page ${currentPage}`,
        success: true,
      };
    } catch (error) {
      return {
        created: totalCreated,
        skipped: totalSkipped,
        total: totalTracks,
        currentPage,
        message: `Error on page ${currentPage}: ${error.message}`,
        success: false,
      };
    }
  }

  async migrateAllExistingTracks(currentPage, batchSize = 5000) {
    try {
      // Get all track IDs instead of full documents to save memory
      const tracks = await trackRepository.getAllTrackIds();
      const trackIds = tracks.map((track) => track._id);
      console.log("completed the fetch the track ids");

      return await this.createBulkTrackerLogsWithPagination(
        trackIds,
        batchSize,
        currentPage
      );
    } catch (error) {
      throw new Error(`Migration failed: ${error.message}`);
    }
  }
}

module.exports = new TrackerLogService();
