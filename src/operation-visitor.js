import * as t from 'babel-types';
import selectionSetToJS from './selection-set-to-js';
import variableDeclarationToJS from './variable-declaration-to-js';

function applyName(graphQLNode, argList) {
  if (graphQLNode.name) {
    argList.push(t.stringLiteral(graphQLNode.name.value));
  }
}

function applyVariables(graphQLNode, argList, clientVar, variablesVar) {
  const definitions = graphQLNode.variableDefinitions;

  if (!(definitions && definitions.length)) {
    return;
  }

  argList.push(variableDeclarationToJS(definitions, clientVar, variablesVar));
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

export default function operationVisitor(jsNodes, clientVar, documentVar, spreadsVar, variablesVar) {
  return function visitor(node) {
    const selectionRootName = 'root';
    const operationDefinitionArgs = [];

    applyName(node, operationDefinitionArgs);
    applyVariables(node, operationDefinitionArgs, clientVar, variablesVar);

    operationDefinitionArgs.push(
      selectionSetToJS(node.selectionSet, selectionRootName, spreadsVar, clientVar, variablesVar)
    );

    jsNodes.push(t.expressionStatement(t.callExpression(
      t.memberExpression(documentVar, t.identifier(operationFactoryFunction(node))),
      operationDefinitionArgs
    )));
  };
}
