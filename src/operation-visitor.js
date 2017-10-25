import * as t from 'babel-types';
import selectionSetToJS from './selection-set-to-js';
import referenceVariablesInOperationDeclaration from './reference-variables-in-operation-declaration';
import operationName from './operation-name';

function applyName(graphQLNode, argList) {
  if (graphQLNode.name) {
    argList.push(t.stringLiteral(graphQLNode.name.value));
  }
}

function applyVariables(operationDefinition, argList, config) {
  const variableDefinitions = operationDefinition.variableDefinitions;

  if (!(variableDefinitions && variableDefinitions.length)) {
    return;
  }

  const name = operationName(operationDefinition);

  argList.push(referenceVariablesInOperationDeclaration(name, variableDefinitions, config));
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

export default function operationVisitor(jsNodes, config) {
  return function visitor(node) {

    const selectionRootName = 'root';
    const operationDefinitionArgs = [];
    const name = operationName(node);

    applyName(node, operationDefinitionArgs);
    applyVariables(node, operationDefinitionArgs, config);

    operationDefinitionArgs.push(
      selectionSetToJS(node.selectionSet, selectionRootName, name, config)
    );

    jsNodes.push(t.expressionStatement(t.callExpression(
      t.memberExpression(config.documentVar, t.identifier(operationFactoryFunction(node))),
      operationDefinitionArgs
    )));
  };
}
