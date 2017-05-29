import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import argValueToJS from '../src/arg-value-to-js';

suite('arg-value-to-js', () => {
  const stringValueQuery = '{field(var: "value")}';
  const enumValueQuery = '{field(var: VALUE)}';
  const intValueQuery = '{field(var: 1)}';
  const floatValueQuery = '{field(var: 1.5)}';
  const booleanValueQuery = '{field(var: true)}';

  test('it can convert string values', () => {
    const valueAst = parse(stringValueQuery).definitions[0].selectionSet.selections[0].arguments[0].value;
    const jsAst = argValueToJS(valueAst, t.identifier('client'));

    assert.equal(generate(jsAst).code, '"value"');
  });

  test('it can convert enum values', () => {
    const valueAst = parse(enumValueQuery).definitions[0].selectionSet.selections[0].arguments[0].value;
    const jsAst = argValueToJS(valueAst, t.identifier('client'));

    assert.equal(generate(jsAst).code, 'client.enum("VALUE")');
  });

  test('it can convert int values', () => {
    const valueAst = parse(intValueQuery).definitions[0].selectionSet.selections[0].arguments[0].value;
    const jsAst = argValueToJS(valueAst, t.identifier('client'));

    assert.equal(generate(jsAst).code, '1');
  });

  test('it can convert float values', () => {
    const valueAst = parse(floatValueQuery).definitions[0].selectionSet.selections[0].arguments[0].value;
    const jsAst = argValueToJS(valueAst, t.identifier('client'));

    assert.equal(generate(jsAst).code, '1.5');
  });

  test('it can convert boolean values', () => {
    const valueAst = parse(booleanValueQuery).definitions[0].selectionSet.selections[0].arguments[0].value;
    const jsAst = argValueToJS(valueAst, t.identifier('client'));

    assert.equal(generate(jsAst).code, 'true');
  });
});
