import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import directiveToJS from '../src/directive-to-js';

suite('directive-to-js', () => {
  const config = {
    clientVar: t.identifier('client'),
    variablesVar: t.identifier('variables')
  };

  test('it converts scalar directive arguments', () => {
    const query = '{field @include(if: true)}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  include: {\n    if: true\n  }\n}');
  });

  test('it converts multiple directive arguments', () => {
    const query = '{field @include(argOne: 1, argTwo: 2.5, argThree: true, argFour: "four")}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  include: {\n    argOne: 1,\n    argTwo: 2.5,\n    argThree: true,\n    argFour: "four"\n  }\n}');
  });

  test('it converts INPUT_OBJECT directive arguments', () => {
    const query = '{field @format(as: {argOne: true})}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  format: {\n    as: {\n      argOne: true\n    }\n  }\n}');
  });

  test('it converts scalar list directive arguments', () => {
    const query = '{field @format(as: ["value-one", 2, "value-three"])}';
    const directiveAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directiveAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  format: {\n    as: ["value-one", 2, "value-three"]\n  }\n}');
  });

  test('it converts list of list directive arguments', () => {
    const query = '{field @format(as: [["value-one"], [2, "value-three"]])}';
    const directiveAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directiveAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  format: {\n    as: [["value-one"], [2, "value-three"]]\n  }\n}');
  });

  test('it converts list of INPUT_OBJECT directive arguments', () => {
    const query = '{field @format(as: [{argOne: "value-one"}, {argTwo: 2, argThree: "value-three"}])}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  format: {\n    as: [{\n      argOne: "value-one"\n    }, {\n      argTwo: 2,\n      argThree: "value-three"\n    }]\n  }\n}');
  });

  test('it converts variables to client variables', () => {
    const query = '{field @include(if: $value)}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  include: {\n    if: variables.__defaultOperation__.value\n  }\n}');
  });

  test('it converts variables nested in directive arguments to client variables', () => {
    const query = '{field @format(as: {key: $value})}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'directives: {\n  format: {\n    as: {\n      key: variables.__defaultOperation__.value\n    }\n  }\n}');
  });

  test('it converts multiple directives', () => {
    const query = '{field @include(if: true) @upper @format(as: $fieldFormat)}';
    const directivesAst = parse(query).definitions[0].selectionSet.selections[0].directives;
    const jsAst = directiveToJS(t.identifier('directives'), directivesAst, '__defaultOperation__', config);

    const code = generate(jsAst).code;

    console.log(code);
    assert.equal(code, 'directives: {\n  include: {\n    if: true\n  },\n  upper: {},\n  format: {\n    as: variables.__defaultOperation__.fieldFormat\n  }\n}');
  });
});
