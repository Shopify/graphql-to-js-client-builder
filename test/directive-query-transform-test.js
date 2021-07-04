import assert from 'assert';
import transform from '../src/index';
import getFixture from './get-fixture';

suite('directive-query-transform-test', () => {
  test('it can transform a complex query with directives', () => {
    const query = getFixture('directive-query.graphql');
    const expectedBuilderCode = getFixture('directive-query.js');

    const builderCode = transform(query);

    assert.equal(builderCode, expectedBuilderCode);
  });
});
