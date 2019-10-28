import { Schema } from '@karmic/core';

export const id: Schema = {
  anyOf: [{ type: 'number' }, { type: 'string' }, { type: 'null' }]
};

export const notification: Schema = {
  type: 'object',
  required: ['jsonrpc', 'method'],
  properties: {
    jsonrpc: { type: 'string', enum: ['2.0'] },
    method: { type: 'string' },
    params: { anyOf: [{ type: 'array' }, { type: 'object' }] }
  },
  not: { required: ['id'] }
};

export const request: Schema = {
  type: 'object',
  required: ['jsonrpc', 'id', 'method'],
  properties: {
    jsonrpc: { type: 'string', enum: ['2.0'] },
    id,
    method: { type: 'string' },
    params: { anyOf: [{ type: 'array' }, { type: 'object' }] }
  }
};

export const response: Schema = {
  definitions: {
    success: {
      type: 'object',
      required: ['jsonrpc', 'id', 'result'],
      properties: {
        jsonrpc: { type: 'string', enum: ['2.0'] },
        id: id,
        result: {},
        error: { not: {} }
      }
    },
    error: {
      type: 'object',
      required: ['jsonrpc', 'id', 'error'],
      properties: {
        jsonrpc: { type: 'string', enum: ['2.0'] },
        id,
        result: { not: {} },
        error: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: { type: 'number' },
            message: { type: 'string' },
            data: {}
          }
        }
      }
    }
  },
  anyOf: [{ $ref: '#/definitions/success' }, { $ref: '#/definitions/error' }]
};
