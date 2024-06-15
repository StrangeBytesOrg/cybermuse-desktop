/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/characters": {
    /** Get all characters */
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              characters: ({
                  id: number;
                  name: string;
                  /** @enum {string} */
                  type: "user" | "character";
                  description: string;
                  firstMessage: string | null;
                  image: string | null;
                })[];
            };
          };
        };
      };
    };
  };
  "/character/{id}": {
    /** Get a character by ID */
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              character: {
                id: number;
                name: string;
                /** @enum {string} */
                type: "user" | "character";
                description: string;
                firstMessage: string | null;
                image: string | null;
              };
            };
          };
        };
      };
    };
  };
  "/create-character": {
    /** Create a character */
    post: {
      requestBody: {
        content: {
          "application/json": {
            id?: number;
            name: string;
            /** @enum {string} */
            type: "user" | "character";
            description: string;
            firstMessage?: string | null;
            image?: string | null;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/update-character/{id}": {
    /** Update a character */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            id?: number;
            name: string;
            /** @enum {string} */
            type: "user" | "character";
            description: string;
            firstMessage?: string | null;
            image?: string | null;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/delete-character/{id}": {
    /** Delete a character */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/chats": {
    /** Get all Chats */
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              chats: ({
                  id: number;
                  createdAt: string;
                  updatedAt: string;
                  characters: ({
                      id: number;
                      chatId: number;
                      characterId: number;
                      character: {
                        id: number;
                        name: string;
                        /** @enum {string} */
                        type: "user" | "character";
                        description: string;
                        firstMessage: string | null;
                        image: string | null;
                      };
                    })[];
                })[];
            };
          };
        };
      };
    };
  };
  "/chat/{id}": {
    /** Get a Chat by ID */
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              chat: {
                id: number;
                createdAt: string;
                updatedAt: string;
                messages: {
                    id: number;
                    chatId: number;
                    characterId: number;
                    generated: boolean;
                    activeIndex: number;
                    content: {
                        id: number;
                        text: string;
                        messageId: number;
                      }[];
                  }[];
              };
              characters: ({
                  id: number;
                  name: string;
                  /** @enum {string} */
                  type: "user" | "character";
                  description: string;
                  firstMessage: string | null;
                  image: string | null;
                })[];
            };
          };
        };
      };
    };
  };
  "/create-chat": {
    /** Create a Chat */
    post: {
      requestBody: {
        content: {
          "application/json": {
            characters: number[];
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              id: number;
            };
          };
        };
      };
    };
  };
  "/delete-chat/{id}": {
    /** Delete a Chat */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/create-message": {
    /** Add a message to the chat */
    post: {
      requestBody: {
        content: {
          "application/json": {
            chatId: number;
            characterId: number;
            text: string;
            generated: boolean;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              messageId?: number;
            };
          };
        };
      };
    };
  };
  "/update-message/{id}": {
    /** Update an existing message */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            text: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/delete-message/{id}": {
    /** Delete a Message */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/generate-message": {
    /** Generate a new response message */
    post: {
      requestBody: {
        content: {
          "application/json": {
            chatId: number;
          };
        };
      };
      responses: {
        /** @description data: {text} */
        200: {
          content: {
            "text/event-stream": string;
          };
        };
      };
    };
  };
  "/models": {
    /** Get all models */
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              models: {
                  name: string;
                  size: number;
                }[];
            };
          };
        };
      };
    };
  };
  "/download-model": {
    /** Download a model */
    post: {
      requestBody: {
        content: {
          "application/json": {
            repoId: string;
            path: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              success: boolean;
            };
          };
        };
      };
    };
  };
  "/set-model-path": {
    /** Set the model folder */
    post: {
      requestBody: {
        content: {
          "application/json": {
            modelPath: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        400: {
          content: {
            "application/json": {
              message: string;
            };
          };
        };
      };
    };
  };
  "/set-autoload": {
    /** Set auto load */
    post: {
      requestBody: {
        content: {
          "application/json": {
            autoLoad: boolean;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/presets": {
    /** Get all generation presets */
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              presets: ({
                  id: number;
                  name: string;
                  context: number;
                  maxTokens: number;
                  temperature: number;
                  seed: number;
                  topK: number | null;
                  topP: number | null;
                  minP: number | null;
                  tfsz: number | null;
                  typicalP: number | null;
                  repeatPenalty: number | null;
                  repeatLastN: number | null;
                  penalizeNL: boolean | null;
                  presencePenalty: number | null;
                  frequencyPenalty: number | null;
                  mirostat: number | null;
                  mirostatTau: number | null;
                  mirostatEta: number | null;
                })[];
              activePresetId: number | null;
            };
          };
        };
      };
    };
  };
  "/preset/{id}": {
    /** Get a generation preset */
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              preset: {
                id: number;
                name: string;
                context: number;
                maxTokens: number;
                temperature: number;
                seed: number;
                topK: number | null;
                topP: number | null;
                minP: number | null;
                tfsz: number | null;
                typicalP: number | null;
                repeatPenalty: number | null;
                repeatLastN: number | null;
                penalizeNL: boolean | null;
                presencePenalty: number | null;
                frequencyPenalty: number | null;
                mirostat: number | null;
                mirostatTau: number | null;
                mirostatEta: number | null;
              };
            };
          };
        };
      };
    };
  };
  "/create-preset": {
    /** Create a generation preset */
    post: {
      requestBody: {
        content: {
          "application/json": {
            id?: number;
            name: string;
            context: number;
            maxTokens: number;
            temperature: number;
            seed: number;
            topK?: number | null;
            topP?: number | null;
            minP?: number | null;
            tfsz?: number | null;
            typicalP?: number | null;
            repeatPenalty?: number | null;
            repeatLastN?: number | null;
            penalizeNL?: boolean | null;
            presencePenalty?: number | null;
            frequencyPenalty?: number | null;
            mirostat?: number | null;
            mirostatTau?: number | null;
            mirostatEta?: number | null;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/update-preset/{id}": {
    /** Update a generation preset */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            id?: number;
            name: string;
            context: number;
            maxTokens: number;
            temperature: number;
            seed: number;
            topK?: number | null;
            topP?: number | null;
            minP?: number | null;
            tfsz?: number | null;
            typicalP?: number | null;
            repeatPenalty?: number | null;
            repeatLastN?: number | null;
            penalizeNL?: boolean | null;
            presencePenalty?: number | null;
            frequencyPenalty?: number | null;
            mirostat?: number | null;
            mirostatTau?: number | null;
            mirostatEta?: number | null;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/delete-preset/{id}": {
    /** Delete a generation preset */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/set-active-preset/{id}": {
    /** Set the active generation preset */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/templates": {
    /** Get all prompt templates */
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              templates: {
                  id: number;
                  name: string;
                  content: string;
                }[];
              activeTemplateId: number;
            };
          };
        };
      };
    };
  };
  "/template/{id}": {
    /** Get a prompt template */
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              template: {
                id: number;
                name: string;
                content: string;
              };
            };
          };
        };
      };
    };
  };
  "/create-template": {
    /** Create a prompt template */
    post: {
      requestBody: {
        content: {
          "application/json": {
            name: string;
            content: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/update-template/{id}": {
    /** Update a prompt template */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            name: string;
            content: string;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/delete-template/{id}": {
    /** Delete a prompt template */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/set-active-template/{id}": {
    /** Set active prompt template */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
  "/status": {
    /** Get status info about the server */
    get: {
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              currentModel: string;
              modelPath?: string;
              autoLoad: boolean;
              loaded: boolean;
              useGPU: boolean;
              contextSize: number;
            };
          };
        };
      };
    };
  };
  "/start-server": {
    /** Load a model */
    post: {
      requestBody: {
        content: {
          "application/json": {
            modelFile: string;
            contextSize: number;
            useGPU: boolean;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          content: {
            "application/json": {
              success: boolean;
            };
          };
        };
      };
    };
  };
  "/stop-server": {
    /** Stop the llama server */
    post: {
      responses: {
        /** @description Default Response */
        200: {
          content: never;
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
