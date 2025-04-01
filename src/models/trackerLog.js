const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackerLogSchema = new Schema({
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tracks',  // Reference to Track model
    required: true
  },
  source: {
    type: String,
    default: null
  },
  feature: {
    type: String,
    default: null
  },
  component: {
    type: String,
    default: null
  },
  actionType: {
    type: String,
    default: null
  },
  action: {
    type: String,
    default: null
  }
},{ timestamps: true });

// Create indexes for better query performance
TrackerLogSchema.index({ track: 1, createdAt: -1 });
TrackerLogSchema.index({ source: 1 });
TrackerLogSchema.index({ feature: 1 });
TrackerLogSchema.index({ component: 1 });
TrackerLogSchema.index({ actionType: 1 });
TrackerLogSchema.index({ action: 1 });

// Compound indexes for common query patterns
TrackerLogSchema.index({ source: 1, feature: 1 });
TrackerLogSchema.index({ source: 1, component: 1 });
TrackerLogSchema.index({ feature: 1, component: 1 });
TrackerLogSchema.index({ actionType: 1, action: 1 });

// Add parseFeature method to schema
TrackerLogSchema.statics.parseAndCreate = async function(trackId, featureString) {
  try {
    const parts = featureString.split('.');
    const logData = {
      track: trackId,
      source: parts[0] || null,
      feature: parts[1] || null,
      component: parts[2] || null,
      actionType: parts[3] || null,
      action: parts[4] || null
    };
    
    return await this.create(logData);
  } catch (error) {
    console.error('Error creating tracker log:', error);
    throw error;
  }
};

const TrackerLog = mongoose.model('TrackerLogs', TrackerLogSchema,'TrackerLogs');

module.exports = TrackerLog;
