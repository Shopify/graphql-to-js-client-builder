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

  test.skip('it can transform a basic query with a custom identifier name', () => {
    const query = getFixture('basic-query.graphql');
    const expectedBuilderCode = getFixture('basic-query.js').replace(/client/, 'ultraClient');

    const builderCode = transform(query, 'ultraClient');

    assert.equal(builderCode, expectedBuilderCode);
  });
});
