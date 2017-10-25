import * as t from 'babel-types';
import {visit} from 'graphql/language';
import sortDefinitions from './sort-definitions';
import fragmentVisitor from './fragment-visitor';
import operationVisitor from './operation-visitor';
import declareVariables from './declare-variables';

function extractFragmentDefinitons(definitions) {
  return definitions.filter((definition) => definition.kind === 'FragmentDefinition');
}

function insertObjectDeclaration(nodes, identifier) {
  nodes.push(t.variableDeclaration('const', [
    t.variableDeclarator(identifier, t.objectExpression([]))
  ]));
}

function declareDocument(nodes, {documentVar, clientVar}) {
  nodes.push(t.variableDeclaration('const', [
    t.variableDeclarator(documentVar,
      t.callExpression(
        t.memberExpression(clientVar, t.identifier('document')),
        []
      )
    )
  ]));
}

export default function documentToJSAst(graphQLAst, config) {
  const jsGraphQLNodes = [];

  declareDocument(jsGraphQLNodes, config);

  const sortedgraphQLAst = Object.assign(
    {},
    graphQLAst,
    {definitions: sortDefinitions(graphQLAst.definitions)}
  );
  const fragmentDefinitons = extractFragmentDefinitons(sortedgraphQLAst.definitions);

  if (fragmentDefinitons.length) {
    insertObjectDeclaration(jsGraphQLNodes, config.spreadsVar);
  }

  jsGraphQLNodes.push(...declareVariables(graphQLAst, config));

  visit(sortedgraphQLAst, {
    FragmentDefinition: fragmentVisitor(jsGraphQLNodes, config),
    OperationDefinition: operationVisitor(jsGraphQLNodes, config)
  });

  return jsGraphQLNodes;
}
