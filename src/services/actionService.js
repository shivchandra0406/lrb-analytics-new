const actionRepo = require("../repositories/actionRepository")

class ActionService{
    async saveActionService(data){
        try{
            return await actionRepo.saveActionAsync(data);
        }catch(err){
            throw err;
        }
    }
    async getActionService(){
        try{
            return await actionRepo.getAllActionAsync();
        }catch(err){
            throw err;
        }
    }
    async updateActionService(filter,data){
        try{
            return await actionRepo.updateActionAsync(filter,data);
        }catch(err){
            throw err;
        }
    }
}


module.exports = new ActionService();