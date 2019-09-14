import { scope } from '~/create/scope';
import { collection } from '~/create/collection';
import { emptyCollection } from '~/create/collection/empty';
import { InputHook } from '~/types';

jest.mock('~/create/collection');

const mocks = {
  collection: collection as jest.Mock
};
mocks.collection.mockImplementation(emptyCollection);

test(`success`, () => {
  mocks.collection.mockClear();

  expect(scope('foo', emptyCollection())).toMatchInlineSnapshot(`
    Object {
      "scopes": Object {
        "foo": Object {
          "scopes": Object {},
          "services": Object {
            "mutation": Object {},
            "query": Object {},
            "subscription": Object {},
          },
        },
      },
      "services": Object {
        "mutation": Object {},
        "query": Object {},
        "subscription": Object {},
      },
      "types": Object {
        "error": Object {},
        "request": Object {},
        "response": Object {},
      },
    }
  `);
  expect(mocks.collection).toHaveBeenCalledTimes(1);
});

test(`adds hooks`, () => {
  mocks.collection.mockClear();

  const hooks: InputHook[] = [];
  scope('foo', emptyCollection(), hooks);
  expect(mocks.collection).toHaveBeenCalledTimes(2);
  expect(mocks.collection.mock.calls[1][1]).toBe(hooks);
});
