import assert from 'assert';
import {parse} from 'graphql/language';
import * as t from 'babel-types';
import generate from 'babel-generator';
import declareVariables from '../src/declare-variables';

suite('declare-variables-test', () => {
  const config = {
    clientVar: t.identifier('client'),
    variablesVar: t.identifier('variables')
  };

  test('it doesn\'t declare a variabels var when the document has no variables', () => {
    const query = '{field}';
    const graphqlAst = parse(query);
    const jsAst = declareVariables(graphqlAst, config);

    assert.equal(jsAst.length, 0);
  });

  test('it declares variables for a single query with variables', () => {
    const query = 'query ($id: ID!) { node(id: $id) { id } }';
    const graphqlAst = parse(query);
    const jsAst = declareVariables(graphqlAst, config);

    const code = generate(t.program(jsAst)).code;

    const expected = `
const variables = {};
variables.__defaultOperation__ = {};
variables.__defaultOperation__.id = client.variable("id", "ID!");
`.trim();

    assert.equal(code, expected);
  });

  test('it recieves custom variables vars', () => {
    const query = 'query ($id: ID!) { node(id: $id) { id } }';
    const graphqlAst = parse(query);
    const jsAst = declareVariables(graphqlAst, {
      ...config,
      variablesVar: t.identifier('customVariables')
    });

    const code = generate(t.program(jsAst)).code;

    const expected = `
const customVariables = {};
customVariables.__defaultOperation__ = {};
customVariables.__defaultOperation__.id = client.variable("id", "ID!");
`.trim();

    assert.equal(code, expected);
  });

  test('it namespaces variables for named operations', () => {
    const query = 'mutation MyMutation ($id: ID!) { node(id: $id) { id } }';
    const graphqlAst = parse(query);
    const jsAst = declareVariables(graphqlAst, config);

    const code = generate(t.program(jsAst)).code;

    const expected = `
const variables = {};
variables.MyMutation = {};
variables.MyMutation.id = client.variable("id", "ID!");
`.trim();

    assert.equal(code, expected);
  });

  test('it can handle multiple operations', () => {
    const query = `
      query MyQuery ($sort: SortKeys) { field(sort: $sort) { id } }
      mutation MyMutation ($sort: InputSortKeys) { updateField(sort: $sort) { id } }
    `;
    const graphqlAst = parse(query);
    const jsAst = declareVariables(graphqlAst, config);

    const code = generate(t.program(jsAst)).code;

    const expected = `
const variables = {};
variables.MyQuery = {};
variables.MyQuery.sort = client.variable("sort", "SortKeys");
variables.MyMutation = {};
variables.MyMutation.sort = client.variable("sort", "InputSortKeys");
`.trim();

    assert.equal(code, expected);
  });
});
