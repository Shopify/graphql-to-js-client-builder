import assert from 'assert';
import {parse} from 'graphql/language';
import sortDefinitions from '../src/sort-definitions';

suite('sort-definitions-test', () => {
  test('it sorts definitions so that fragments come first', () => {
    const ast = parse(`
      query QueryOne {
        shop {
          name
        }
      }
      fragment ShopFragment on Shop {
        locale
      }
      query QueryTwo {
        node(id: "1") {
          ... on Product {
            title
          }
        }
      }
      fragment ProductFragment on Product {
        handle
      }
    `);

    const sortedDefinitions = sortDefinitions(ast.definitions);

    assert.deepEqual(sortedDefinitions.map((definition) => definition.kind), [
      'FragmentDefinition',
      'FragmentDefinition',
      'OperationDefinition',
      'OperationDefinition'
    ]);
  });

  test('it sorts dependent fragments into the right order', () => {
    const ast = parse(`
      fragment ShopFragment on Shop {
        products(first: 10) {
          edges {
            node {
              ...ProductFragment
            }
          }
        }
      }
      fragment VariantsFragment on Variant {
        title
        image {
          src
        }
      }
      fragment ProductFragment on Product {
        variants(first: 100) {
          edges {
            node {
              ...VariantsFragment
            }
          }
        }
      }
    `);

    const sortedDefinitions = sortDefinitions(ast.definitions);

    assert.deepEqual(sortedDefinitions.map((definition) => definition.name.value), [
      'VariantsFragment',
      'ProductFragment',
      'ShopFragment'
    ]);
  });

  test('it detects cycles in fragments', () => {
    const ast = parse(`
      fragment VariantsFragment on Variant {
        product {
          ...ProductFragment
        }
      }
      fragment ProductFragment on Product {
        variants(first: 100) {
          edges {
            node {
              ...VariantsFragment
            }
          }
        }
      }
    `);

    assert.throws(() => {
      sortDefinitions(ast.definitions);
    }, /Fragments cannot contain a cycle/);
  });
});
