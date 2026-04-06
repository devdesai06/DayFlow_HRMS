export class ApiResponse {
  constructor({ message, data = {}, pagination }) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (pagination) this.pagination = pagination;
  }
}

