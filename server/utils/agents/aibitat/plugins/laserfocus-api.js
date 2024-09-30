const axios = require('axios');
const Provider = require("../providers/ai-provider");

const laserfocusApi = {
  name: "laserfocus-api",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          controller: new AbortController(),
          description:
            "Interacts with the Laserfocus API, supporting both GET and POST requests. Always use Laserfocus API schema and context to figure out the correct endpoint, method and parameters.",
          examples: [
            {
              prompt: "Get user with name Andres from database",
              call: JSON.stringify({ endpoint: "/database/read", method: "POST", params: { table: "user", query: {name: 'Andres'} }}),
            },
            {
              prompt: "Get the current weather",
              call: JSON.stringify({ endpoint: "/weather", method: "GET", params: {}}),
            },
            {
              prompt: "Get the current date and time",
              call: JSON.stringify({ endpoint: "/", method: "GET", params: {}}),
            },
            {
              prompt: "Test connection to Laserfocus API",
              call: JSON.stringify({ endpoint: "/", method: "GET", params: {} }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              endpoint: {
                type: "string",
                description: "The API endpoint to call",
              },
              method: {
                type: "string",
                enum: ["GET", "POST"],
                description: "The HTTP method to use for the request",
              },
              params: {
                type: "string",
                description: "Parameters for the API request",
              },
            },
            required: ["endpoint", "method", "params"],
            additionalProperties: false,
          },
          handler: async function ({ endpoint, method, params }) {
            try {
              return await this.makeApiRequest(endpoint, method, params);
            } catch (error) {
              return `There was an error while calling the LaserFocus API: ${error.message}`;
            }
          },

          makeApiRequest: async function (endpoint, method, params) {
            this.super.introspect(
              `${this.caller}: Making a ${method} request to ${endpoint}`
            );

            const baseUrl = 'http://192.168.0.104:5002';
            const url = `${baseUrl}${endpoint}`;

            console.log(method, endpoint, params);

            try {
              let response;
              if (method === 'GET') {
                response = await axios.get(url);
              } else if (method === 'POST') {
                response = await axios.post(url, params);
              }

              if (response.status >= 200 && response.status < 300) {
                return JSON.stringify(response.data);
              } else {
                throw new Error(`API request failed with status ${response.status}`);
              }
            } catch (error) {
              this.super.introspect(
                `${this.caller}: Error making request to ${url}: ${error.message}`
              );
              throw error;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  laserfocusApi,
};