import * as t from 'babel-types';
import selectionSetToJS from './selection-set-to-js';
import referenceVariablesInOperationDeclaration from './reference-variables-in-operation-declaration';
import operationName from './operation-name';

function applyName(graphQLNode, argList) {
  if (graphQLNode.name) {
    argList.push(t.stringLiteral(graphQLNode.name.value));
  }
}

function applyVariables(operationDefinition, argList, variablesVar) {
  const variableDefinitions = operationDefinition.variableDefinitions;

  if (!(variableDefinitions && variableDefinitions.length)) {
    return;
  }

  const name = operationName(operationDefinition);

  argList.push(referenceVariablesInOperationDeclaration(name, variableDefinitions, variablesVar));
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

    // node.name.value
    const selectionRootName = 'root';
    const operationDefinitionArgs = [];
    const name = operationName(node);

    applyName(node, operationDefinitionArgs);
    applyVariables(node, operationDefinitionArgs, variablesVar);

    operationDefinitionArgs.push(
      selectionSetToJS(node.selectionSet, selectionRootName, name, spreadsVar, clientVar, variablesVar)
    );

    jsNodes.push(t.expressionStatement(t.callExpression(
      t.memberExpression(documentVar, t.identifier(operationFactoryFunction(node))),
      operationDefinitionArgs
    )));
  };
}
