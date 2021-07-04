import assert from 'assert';
import {parse} from 'graphql/language';
import generate from 'babel-generator';
import * as t from 'babel-types';
import selectionSetToJS from '../src/selection-set-to-js';

suite('selection-set-to-js-test', () => {
  const config = {
    spreadsVar: t.identifier('spreads'),
    clientVar: t.identifier('client'),
    variablesVar: t.identifier('variables')
  };

  test('it can convert fields within a selection', () => {
    const query = '{fieldOne fieldTwo}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne");\n  root.add("fieldTwo");\n}');
  });

  test('it can convert named fragments within a selection', () => {
    const query = '{...MyFragment}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.addFragment(spreads.MyFragment);\n}');
  });

  test('it can convert aliased fields within a selection', () => {
    const query = '{fieldOne fieldTwo: fieldThree}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne");\n  root.add("fieldThree", {\n    alias: "fieldTwo"\n  });\n}');
  });

  test('it can convert fields with arguments within a selection', () => {
    const query = '{fieldOne(fancy: true)}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    args: {\n      fancy: true\n    }\n  });\n}');
  });


  test('it can convert fields with directives within a selection', () => {
    const query = '{fieldOne @include(if: true)}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    directives: {\n      include: {\n        if: true\n      }\n    }\n  });\n}');
  });

  test('it can convert fields with arguments and directives within a selection', () => {
    const query = '{fieldOne(fancy: true) @format(as: $fieldOneFormat)}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    args: {\n      fancy: true\n    },\n    directives: {\n      format: {\n        as: variables.__defaultOperation__.fieldOneFormat\n      }\n    }\n  });\n}');
  });

  test('it can convert fields with selections within a selection', () => {
    const query = '{fieldOne {nestedFieldOne nestedFieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", fieldOne => {\n    fieldOne.add("nestedFieldOne");\n    fieldOne.add("nestedFieldTwo");\n  });\n}');
  });

  test('it can convert fields with arguments and selections within a selection', () => {
    const query = '{fieldOne(extraFancy: $FancinessQuotient) {nestedFieldOne nestedFieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    args: {\n      extraFancy: variables.__defaultOperation__.FancinessQuotient\n    }\n  }, fieldOne => {\n    fieldOne.add("nestedFieldOne");\n    fieldOne.add("nestedFieldTwo");\n  });\n}');
  });

  test('it can convert fields with directives and selections within a selection', () => {
    const query = '{fieldOne @include(if: $includeFieldOne) {nestedFieldOne nestedFieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", {\n    directives: {\n      include: {\n        if: variables.__defaultOperation__.includeFieldOne\n      }\n    }\n  }, fieldOne => {\n    fieldOne.add("nestedFieldOne");\n    fieldOne.add("nestedFieldTwo");\n  });\n}');
  });

  test('it can convert fields and selections with directives within a selection', () => {
    const query = '{fieldOne {nestedFieldOne @skip(if: true)}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.add("fieldOne", fieldOne => {\n    fieldOne.add("nestedFieldOne", {\n      directives: {\n        skip: {\n          if: true\n        }\n      }\n    });\n  });\n}');
  });

  test('it can convert inline fragments within a selection', () => {
    const query = '{... on TheThing {fieldOne, fieldTwo}}';
    const selectionSetAst = parse(query).definitions[0].selectionSet;
    const jsAst = selectionSetToJS(selectionSetAst, 'root', '__defaultOperation__', config);

    const code = generate(jsAst).code;

    assert.equal(code, 'root => {\n  root.addInlineFragmentOn("TheThing", TheThing => {\n    TheThing.add("fieldOne");\n    TheThing.add("fieldTwo");\n  });\n}');
  });
});
