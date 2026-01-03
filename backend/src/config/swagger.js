import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HRMS Backend API",
      version: "1.0.0",
      description:
        "Human Resource Management System API documentation"
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Local server"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"] // Swagger reads comments from routes
};

export default swaggerJsdoc(options);
