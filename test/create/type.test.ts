import { error, request, response } from '~/create/type';

describe(`error`, () => {
  test(`success`, () => {
    expect(error('ExampleError', { code: 'ServerError' }))
      .toMatchInlineSnapshot(`
        Object {
          "scopes": Object {},
          "services": Object {
            "mutation": Object {},
            "query": Object {},
            "subscription": Object {},
          },
          "types": Object {
            "error": Object {
              "ExampleError": Object {
                "code": "ServerError",
              },
            },
            "request": Object {},
            "response": Object {},
          },
        }
      `);
  });
});

describe(`request`, () => {
  test(`success`, () => {
    expect(request('ExampleRequest', { schema: { type: 'object' } }))
      .toMatchInlineSnapshot(`
        Object {
          "scopes": Object {},
          "services": Object {
            "mutation": Object {},
            "query": Object {},
            "subscription": Object {},
          },
          "types": Object {
            "error": Object {},
            "request": Object {
              "ExampleRequest": Object {
                "schema": Object {
                  "type": "object",
                },
              },
            },
            "response": Object {},
          },
        }
      `);
  });
});

describe(`response`, () => {
  test(`success`, () => {
    expect(response('ExampleResponse', { schema: { type: 'object' } }))
      .toMatchInlineSnapshot(`
        Object {
          "scopes": Object {},
          "services": Object {
            "mutation": Object {},
            "query": Object {},
            "subscription": Object {},
          },
          "types": Object {
            "error": Object {},
            "request": Object {},
            "response": Object {
              "ExampleResponse": Object {
                "children": Object {
                  "query": Object {},
                  "subscription": Object {},
                },
                "schema": Object {
                  "type": "object",
                },
              },
            },
          },
        }
      `);
  });
});
