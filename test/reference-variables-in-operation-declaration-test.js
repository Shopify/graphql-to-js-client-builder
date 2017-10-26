import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import referenceVariablesInOperationDeclaration from '../src/reference-variables-in-operation-declaration';

suite('reference-variables-in-operation-declaration-test', () => {
  const config = {
    variablesVar: t.identifier('variables')
  };

  test('it can handle a single variable', () => {
    const query = 'query ($var: Int) {field}';
    const variableAsts = parse(query).definitions[0].variableDefinitions;
    const jsAst = referenceVariablesInOperationDeclaration(
      '__defaultOperation__',
      variableAsts,
      config
    );

    const code = generate(jsAst).code;

    assert.equal(code, '[variables.__defaultOperation__.var]');
  });

  test('it can handle multiple variables', () => {
    const query = 'query ($var: Int, $foo: Bar!) {field}';
    const variableAsts = parse(query).definitions[0].variableDefinitions;
    const jsAst = referenceVariablesInOperationDeclaration(
      '__defaultOperation__',
      variableAsts,
      config
    );

    const code = generate(jsAst).code;

    assert.equal(code, '[variables.__defaultOperation__.var, variables.__defaultOperation__.foo]');
  });

  test('it can handle variables in a named operation', () => {
    const query = 'mutation MyGloriousMutation ($var: Int) {field}';
    const variableAsts = parse(query).definitions[0].variableDefinitions;
    const jsAst = referenceVariablesInOperationDeclaration(
      'MyGloriousMutation',
      variableAsts,
      config
    );

    const code = generate(jsAst).code;

    assert.equal(code, '[variables.MyGloriousMutation.var]');
  });
});
