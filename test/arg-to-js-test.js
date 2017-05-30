import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import argToJS from '../src/parse-arg';

suite('arg-to-js', () => {

  test('it converts scalar arguments', () => {
    const query = '{field(argName: "value")}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: "value"\n}');
  });

  test('it converts multiple arguments', () => {
    const query = '{field(argOne: 1, argTwo: 2.5, argThree: true)}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argOne: 1,\n  argTwo: 2.5,\n  argThree: true\n}');
  });

  test('it converts hash arguments', () => {
    const query = '{field(hash: {argOne: true})}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  hash: {\n    argOne: true\n  }\n}');
  });

  test('it converts scalar list arguments', () => {
    const query = '{field(argName: ["value-one", 2, "value-three"])}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: ["value-one", 2, "value-three"]\n}');
  });

  test('it converts list of list arguments', () => {
    const query = '{field(argName: [["value-one"], [2, "value-three"]])}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: [["value-one"], [2, "value-three"]]\n}');
  });

  test('it converts list of hash arguments', () => {
    const query = '{field(argName: [{argOne: "value-one"}, {argTwo: 2, argThree: "value-three"}])}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: [{\n    argOne: "value-one"\n  }, {\n    argTwo: 2,\n    argThree: "value-three"\n  }]\n}');
  });

  test('it converts variables to client variables', () => {
    const query = '{field(argName: $value)}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: client.variable("value")\n}');
  });

  test('it converts variables nested in arguments to client variables', () => {
    const query = '{field(argName: $value)}';
    const argumentsAst = parse(query).definitions[0].selectionSet.selections[0].arguments;
    const jsAst = argToJS(t.identifier('args'), argumentsAst, t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'args: {\n  argName: client.variable("value")\n}');
  });
});
