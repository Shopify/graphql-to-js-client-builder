import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import variableReference from '../src/variable-reference';

suite('variable-reference-test', () => {

  test('it can handle a variable for an unnamed operation', () => {
    const query = 'query ($var: Int) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const operationName = 'MyOperation';
    const jsAst = variableReference(operationName, variableAst.variable, {
      variablesVar: t.identifier('variables')
    });

    const code = generate(jsAst).code;

    assert.equal(code, 'variables.MyOperation.var');
  });

  test('it can handle a custom variables var', () => {
    const query = 'mutation ($var: Int) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const operationName = '__defaultOperation__';
    const jsAst = variableReference(operationName, variableAst.variable, {
      variablesVar: t.identifier('vars')
    });

    const code = generate(jsAst).code;

    assert.equal(code, 'vars.__defaultOperation__.var');
  });
});
