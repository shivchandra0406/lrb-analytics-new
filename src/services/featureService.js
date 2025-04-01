const featureRepo = require("../repositories/featureRepository")

class FeatureService {
    async saveAsync(data) {
        try {
            return featureRepo.saveAsync(data)
        } catch (err) {
            throw err;
        }
    }
    async getAllAsync() {
        try {
            return featureRepo.getAllAsync();
        } catch (err) {
            throw err;
        }
    }
    async updateAsync(filter, data) {
        try {
            return featureRepo.updateAsync(filter, data)
        } catch (err) {
            throw err;
        }
    }
}


module.exports = new FeatureService();