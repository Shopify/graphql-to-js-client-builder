import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import selectionSetToJS from '../src/get-selections';

suite('selection-set-to-js-test', () => {
  test('it can convert fields within a selection', () => {
    const query = '{fieldOne fieldTwo}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne");\n  root.add("fieldTwo");\n}');
  });

  test('it can convert named fragments within a selection', () => {
    const query = '{...MyFragment}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.addFragment(spreads.MyFragment);\n}');
  });

  test('it can convert aliased fields within a selection', () => {
    const query = '{fieldOne fieldTwo: fieldThree}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne");\n  root.add("fieldThree", {\n    alias: "fieldTwo"\n  });\n}');
  });

  test('it can convert fields with arguments within a selection', () => {
    const query = '{fieldOne(fancy: true)}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    args: {\n      fancy: true\n    }\n  });\n}');
  });

  test('it can convert fields with selections within a selection', () => {
    const query = '{fieldOne {nestedFieldOne nestedFieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", fieldOne => {\n    fieldOne.add("nestedFieldOne");\n    fieldOne.add("nestedFieldTwo");\n  });\n}');
  });

  test('it can convert fields with arguments and selections within a selection', () => {
    const query = '{fieldOne(extraFancy: $FancinessQuotient) {nestedFieldOne nestedFieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    args: {\n      extraFancy: client.variable("FancinessQuotient")\n    }\n  }, fieldOne => {\n    fieldOne.add("nestedFieldOne");\n    fieldOne.add("nestedFieldTwo");\n  });\n}');
  });

  test('it can convert inline fragments within a selection', () => {
    const query = '{... on TheThing {fieldOne, fieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', t.identifier('spreads'), t.identifier('client'));

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.addInlineFragmentOn("TheThing", TheThing => {\n    TheThing.add("fieldOne");\n    TheThing.add("fieldTwo");\n  });\n}');
  });
});
