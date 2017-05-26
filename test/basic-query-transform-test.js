import assert from 'assert';
import transform from '../src/index';
import getFixture from './get-fixture';

suite('basic-query-transform-test', () => {
  test('it can transform a basic query', () => {
    const query = getFixture('basic-query.graphql');
    const expectedBuilderCode = getFixture('basic-query.js');

    const builderCode = transform(query);

    assert.equal(builderCode, expectedBuilderCode);
  });

  test('it can transform a basic query with custom identifiers', () => {
    const query = getFixture('basic-query.graphql');
    const expectedBuilderCode = getFixture('basic-query-with-custom-var.js');

    const builderCode = transform(query, 'fancyClient', 'someOtherDocument');

    assert.equal(builderCode, expectedBuilderCode);
  });
});
