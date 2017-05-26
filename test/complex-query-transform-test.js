import assert from 'assert';
import transform from '../src/index';
import getFixture from './get-fixture';

suite('complex-query-transform-test', () => {
  test('it can transform a complex query', () => {
    const query = getFixture('complex-query.graphql');
    const expectedBuilderCode = getFixture('complex-query.js');

    const builderCode = transform(query);

    assert.equal(builderCode, expectedBuilderCode);
  });
});
