class Response {
    constructor(isSuccess = true, data = null, message = '', error = null) {
      this.isSuccess = isSuccess;  
      this.data = data;            
      this.message = message;      
      this.error = error;          
    }
  
    // Static method for success response
    static success(data, message = 'Operation successful') {
      return new Response(true, data, message, null);
    }
  
    // Static method for error response
    static error(error, message = 'An error occurred') {
      return new Response(false, null, message, error);
    }
  
    // Method to get the response as an object
    toObject() {
      return {
        isSuccess: this.isSuccess,
        data: this.data,
        message: this.message,
        error: this.error,
      };
    }
  }
  
  module.exports = Response;
  