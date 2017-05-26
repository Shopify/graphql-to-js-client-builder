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

function declareDocument(nodes, clientVar, documentVar) {
  nodes.push(t.variableDeclaration('const', [
    t.variableDeclarator(documentVar,
      t.callExpression(
        t.memberExpression(clientVar, t.identifier('document')),
        []
      )
    )
  ]));
}

export default function documentToJSAst(graphQLAst, clientVar, documentVar, spreadsVar) {
  const jsGraphQLNodes = [];

  declareDocument(jsGraphQLNodes, clientVar, documentVar);

  const sortedgraphQLAst = Object.assign(
    {},
    graphQLAst,
    {definitions: sortDefinitions(graphQLAst.definitions)}
  );
  const fragmentDefinitons = extractFragmentDefinitons(sortedgraphQLAst.definitions);

  if (fragmentDefinitons.length) {
    insertSpreadVar(jsGraphQLNodes, spreadsVar);
  }

  visit(sortedgraphQLAst, {
    FragmentDefinition: fragmentVisitor(jsGraphQLNodes, clientVar, documentVar, spreadsVar),
    OperationDefinition: operationVisitor(jsGraphQLNodes, clientVar, documentVar, spreadsVar)
  });

  return jsGraphQLNodes;
}
