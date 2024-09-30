const Provider = require("../providers/ai-provider");

const uiComponentGenerator = {
  name: "ui-component-generator",
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
            "Generates a UI component with customizable content and styling.",
          examples: [
            {
              prompt: "Generate a UI button component",
              call: JSON.stringify({ type: "button", content: "Click me" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "The type of the UI component to generate",
              },
              content: {
                type: "string",
                description: "The content of the component",
              },
            },
            required: ["type", "content"],
            additionalProperties: false,
          },
          handler: async function ({ type, content }) {
            try {
              return this.generateCardWidget(type, content);
            } catch (error) {
              return `There was an error while generating the UI component: ${error.message}`;
            }
          },

          generateCardWidget: function (type, content) {
            this.super.introspect(
              `${this.caller}: Generating a UI component with type: ${type}`
            );

            let component;
            if (type === "button") {
              component = `<button className="bg-primary text-background inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">${content}</button>`;
            }

            return component
          },
        });
      },
    };
  },
};

module.exports = {
  uiComponentGenerator,
};
