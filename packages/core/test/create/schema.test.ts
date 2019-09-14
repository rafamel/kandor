import schema from '~/create/schema';

test(`creates schema`, () => {
  expect(schema({ type: 'string' })).toMatchInlineSnapshot(`
    Object {
      "type": "string",
    }
  `);
});

test(`adds type object when no type`, () => {
  expect(schema({ properties: { name: { type: 'string' } } }))
    .toMatchInlineSnapshot(`
      Object {
        "properties": Object {
          "name": Object {
            "type": "string",
          },
        },
        "type": "object",
      }
    `);
});
