import Ajv from 'ajv';
import draft04 from 'ajv/lib/refs/json-schema-draft-04.json';
import { notification, request, response } from './schemas';
import { RPCSpecNotification, RPCSpecRequest, RPCSpecResponse } from '~/types';

const ajv = new Ajv({ schemaId: 'id', logger: false });
ajv.addMetaSchema(draft04);

const validateNotification = ajv.compile(notification);
const validateRequest = ajv.compile(request);
const validateResponse = ajv.compile(response);

export const validate = {
  notification(data: object): data is RPCSpecNotification {
    return validateNotification(data) as boolean;
  },
  request(data: object): data is RPCSpecRequest {
    return validateRequest(data) as boolean;
  },
  response(data: object): data is RPCSpecResponse {
    return validateResponse(data) as boolean;
  }
};
