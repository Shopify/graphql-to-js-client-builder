import * as t from 'babel-types';
import getSelections from './get-selections';
import parseVariable from './parse-variable';

function applyName(graphQLNode, argList) {
  if (graphQLNode.name) {
    argList.push(t.stringLiteral(graphQLNode.name.value));
  }
}

function applyVariables(graphQLNode, argList, clientVar) {
  const definitions = graphQLNode.variableDefinitions;

  if (!(definitions && definitions.length)) {
    return;
  }

  argList.push(parseVariable(definitions, clientVar));
}

function operationFactoryFunction(graphQLNode) {
  switch (graphQLNode.operation) {
    case 'query':
      return 'addQuery';
    case 'mutation':
      return 'addMutation';
    default:
      throw new Error(`Operation: "${graphQLNode.operation}" is not currently supported`);
  }
}

export default function operationVisitor(jsNodes, clientVar, documentVar, spreadsVar) {
  return function visitor(node) {
    const selectionRootName = 'root';
    const operationDefinitionArgs = [];

    applyName(node, operationDefinitionArgs);
    applyVariables(node, operationDefinitionArgs, clientVar);

    operationDefinitionArgs.push(
      t.arrowFunctionExpression(
        [t.identifier(selectionRootName)],
        t.blockStatement(getSelections(node.selectionSet, selectionRootName, spreadsVar, clientVar))
      )
    );

    jsNodes.push(t.expressionStatement(t.callExpression(
      t.memberExpression(documentVar, t.identifier(operationFactoryFunction(node))),
      operationDefinitionArgs
    )));
  };
}
