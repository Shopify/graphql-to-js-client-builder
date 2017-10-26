import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import constructJSVariableDefinition from '../src/construct-js-variable-definition';

suite('construct-js-variable-definition-test', () => {
  const config = {
    clientVar: t.identifier('client'),
    variablesVar: t.identifier('variables')
  };

  test('it can convert a typed variable', () => {
    const query = 'query ($var: Int) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "Int")');
  });

  test('it can convert a typed variable with a default', () => {
    const query = 'query ($var: Boolean = true) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "Boolean", true)');
  });

  test('it can convert a non-null typed variable', () => {
    const query = 'query ($var: Int!) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "Int!")');
  });

  test('it can convert a non-null typed variable with a default', () => {
    const query = 'query ($var: String! = "beans") {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "String!", "beans")');
  });

  test('it can convert a list type variable', () => {
    const query = 'query ($var: [Things]) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "[Things]")');
  });

  test('it can convert a list type variable with a default', () => {
    const query = 'query ($var: [Things] = [{stuff: true}]) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "[Things]", [{\n  stuff: true\n}])');
  });

  test('it can convert a list type variable with non-null elements', () => {
    const query = 'query ($var: [AnEnumType!]) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "[AnEnumType!]")');
  });

  test('it can convert a list type variable with non-null elements with a default', () => {
    const query = 'query ($var: [AnEnumType!] = [BEANS]) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "[AnEnumType!]", [client.enum("BEANS")])');
  });

  test('it can convert a non-null list type variable with non-null elements', () => {
    const query = 'query ($var: [SomeOtherType!]!) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "[SomeOtherType!]!")');
  });

  test('it can convert a non-null list type variable with non-null elements with a default', () => {
    const query = 'query ($var: [SomeOtherType!]! = [{foo: {bar: "baz"}}]) {field}';
    const variableAst = parse(query).definitions[0].variableDefinitions[0];
    const jsAst = constructJSVariableDefinition(variableAst, config);

    const code = generate(jsAst).code;

    assert.equal(code, 'client.variable("var", "[SomeOtherType!]!", [{\n  foo: {\n    bar: "baz"\n  }\n}])');
  });
});
