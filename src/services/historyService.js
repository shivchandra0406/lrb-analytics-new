const historyRepo = require("../repositories/historyRepository");

class HistoryService {
  async saveAsync(data) {
    try {
      let filter = {};
      if (data.refId) filter.refId = data.refId; 
      if (data.tenantId) filter.tenantId = data.tenantId;

      // Get existing records based on the filter
      var existings = await historyRepo.getByFilterAsync(filter);

      if (existings?.length > 0) {
        // Find the existing record (use the first one or adjust logic if needed)
        var existing = existings[0];

        // Update only the `context` field in the existing record
        existing.context.push(data.context); // Append the new context to the existing array

        // Update the record in the database
        return await historyRepo.updateAsync(filter, {
          context: existing.context,
        });
      } else {
        // If no existing record, save the new data
        return await historyRepo.saveAsync(data);
      }
    } catch (err) {
      throw err;
    }
  }

  async getAllAsync(req) {
    try {
      const { resource, refId, tenantId, fromDate, toDate } = req.query;

      let filter = {};

      // Add filters for each parameter if provided
      if (resource) filter.resource = resource;
      if (refId) filter.refId = refId;
      if(tenantId) filter.tenantId = tenantId;

      // Handle date range filtering for createdAt
      if (fromDate || toDate) {
        filter.createdAt = {}; // Initialize createdAt filter

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
      return historyRepo.getAllAsync(filter);
    } catch (err) {
      throw err;
    }
  }
  async updateAsync(filter, data) {
    try {
      return historyRepo.updateAsync(filter, data);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new HistoryService();
