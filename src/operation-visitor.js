import * as t from 'babel-types';
import getSelections from './get-selections';
import parseVariable from './parse-variable';

function applyName(graphQLNode, argList) {
  if (graphQLNode.name) {
    argList.push(t.stringLiteral(graphQLNode.name.value));
  }
}

function applyVariables(graphQLNode, argList, clientVar) {
  if (!(graphQLNode.variableDefinitions && graphQLNode.variableDefinitions.length)) {
    return;
  }

  const variables = graphQLNode.variableDefinitions.map((variable) => {
    return parseVariable(variable, clientVar);
  });

  argList.push(t.arrayExpression(variables));
}

function operationFactoryFunction(graphQLNode) {
  if (graphQLNode.operation === 'query') {
    return 'addQuery';
  } else {
    return 'addMutation';
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
