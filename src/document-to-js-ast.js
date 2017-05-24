import * as t from 'babel-types';
import {visit} from 'graphql/language';
import sortDefinitions from './sort-definitions';
import fragmentVisitor from './fragment-visitor';
import operationVisitor from './operation-visitor';

function extractFragmentDefinitons(definitions) {
  return definitions.filter((definition) => definition.kind === 'FragmentDefinition');
}

function insertSpreadVar(nodes, identifier) {
  nodes.push(t.variableDeclaration('const', [
    t.variableDeclarator(identifier, t.objectExpression([]))
  ]));
}

export default function documentToJSAst(graphQLAst, clientVar, documentVar, spreadsVar) {
  const jsGraphQLNodes = [];
  const sortedgraphQLAst = Object.assign(
    {},
    graphQLAst,
    {definitions: sortDefinitions(graphQLAst.definitions)}
  );

  const fragmentDefinitons = extractFragmentDefinitons(sortedgraphQLAst.definitions);

  if (fragmentDefinitons.length) {
    insertSpreadVar(jsGraphQLNodes, spreadsVar);
  }

  visit(graphQLAst, {
    FragmentDefinition: fragmentVisitor(jsGraphQLNodes, clientVar, documentVar, spreadsVar),
    OperationDefinition: operationVisitor(jsGraphQLNodes, clientVar, documentVar, spreadsVar)
  });

  return jsGraphQLNodes;
}
