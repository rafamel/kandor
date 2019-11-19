import Ajv from 'ajv';
import draft04 from 'ajv/lib/refs/json-schema-draft-04.json';

const ajv = new Ajv({ schemaId: 'id', logger: false });
ajv.addMetaSchema(draft04);

export const validator = ajv;
