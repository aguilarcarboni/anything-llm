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
            "Interacts with the laserfocus-api.onrender.com API, supporting both GET and POST requests.",
          examples: [
            {
              prompt: "Get user with name Andres from database",
              call: JSON.stringify({ endpoint: "/database/query", method: "POST", params: { database: "users", table: "user", query: {name: 'Andres'} }}),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              endpoint: {
                type: "string",
                description: "The API endpoint to call (e.g., '/database/query')",
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

            const baseUrl = 'https://laserfocus-api.onrender.com';
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