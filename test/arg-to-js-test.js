import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import argToJS from '../src/arg-to-js';

suite('arg-to-js', () => {

  test('it converts scalar arguments', () => {
    const query = '{field(argName: "value")}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: "value"\n}');
  });

  test('it converts multiple arguments', () => {
    const query = '{field(argOne: 1, argTwo: 2.5, argThree: true)}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argOne: 1,\n  argTwo: 2.5,\n  argThree: true\n}');
  });

  test('it converts INPUT_OBJECT arguments', () => {
    const query = '{field(input: {argOne: true})}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  input: {\n    argOne: true\n  }\n}');
  });

  test('it converts scalar list arguments', () => {
    const query = '{field(argName: ["value-one", 2, "value-three"])}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: ["value-one", 2, "value-three"]\n}');
  });

  test('it converts list of list arguments', () => {
    const query = '{field(argName: [["value-one"], [2, "value-three"]])}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: [["value-one"], [2, "value-three"]]\n}');
  });

  test('it converts list of INPUT_OBJECT arguments', () => {
    const query = '{field(argName: [{argOne: "value-one"}, {argTwo: 2, argThree: "value-three"}])}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: [{\n    argOne: "value-one"\n  }, {\n    argTwo: 2,\n    argThree: "value-three"\n  }]\n}');
  });

  test('it converts variables to client variables', () => {
    const query = '{field(argName: $value)}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: variables["value"]\n}');
  });

  test('it converts variables nested in arguments to client variables', () => {
    const query = '{field(argName: $value)}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'), t.identifier('variables'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: variables["value"]\n}');
  });
});
