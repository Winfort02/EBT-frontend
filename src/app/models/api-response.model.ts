export class ApiResponse<Model> {
   timeStamp: string;
   data: Model;
   message: string;

   constructor(timestamp: string, data: Model, message: string) {
      this.timeStamp = timestamp;
      this.data = data;
      this.message = message;
   }
}