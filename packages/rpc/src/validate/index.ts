import { notification, request, response } from './schemas';
import { RPCSpecNotification, RPCSpecRequest, RPCSpecResponse } from '~/types';
import { validator } from '@karmic/core';

const validateNotification = validator.compile(notification);
const validateRequest = validator.compile(request);
const validateResponse = validator.compile(response);

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
