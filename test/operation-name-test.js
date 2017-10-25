import assert from 'assert';
import {parse} from 'graphql/language';
import operationName from '../src/operation-name';

suite('operation-name-test', () => {
  test('it returns the operation name for a named operation', () => {
    const query = 'mutation MyMutation {field}';
    const operationAst = parse(query).definitions[0];

    const name = operationName(operationAst);

    assert.equal(name, 'MyMutation');
  });

  test('it returns "__defaultOperation__" for an unnamed operation', () => {
    const query = 'query {field}';
    const operationAst = parse(query).definitions[0];

    const name = operationName(operationAst);

    assert.equal(name, '__defaultOperation__');
  });
});
