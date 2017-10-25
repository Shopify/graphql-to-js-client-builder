import * as t from 'babel-types';
import constructJSVariableDefinition from './construct-js-variable-definition';

function isOperationDefinition(definition) {
  return definition.kind === 'OperationDefinition';
}

function hasVariables(definition) {
  return definition.variableDefinitions && definition.variableDefinitions.length;
}

function nameFromOperation(operationDefinition) {
  return operationDefinition.name ? operationDefinition.name.value : '__defaultOperation__';
}

function variablesDeclaration(variablesVar) {
  return t.variableDeclaration('const', [
    t.variableDeclarator(variablesVar, t.objectExpression([]))
  ]);
}

function variablesHashForOperationDeclaration(variablesVar, operationName) {
  return t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        variablesVar,
        t.identifier(operationName)
      ),
      t.objectExpression([])
    )
  );
}

function declareVariableForOperation(variablesVar, operationName, variableAst) {
  return t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        t.memberExpression(
          variablesVar,
          t.identifier(operationName)
        ),
        t.identifier(variableAst.variable.name.value)
      ),
      constructJSVariableDefinition(variableAst, t.identifier('client'), variablesVar)
    )
  );
}

export default function declareVariables(graphqlAst, variablesVar) {
  const operationsWithVariables = graphqlAst
    .definitions
    .filter(isOperationDefinition)
    .filter(hasVariables);

  if (!operationsWithVariables.length) {
    return [];
  }

  return [
    variablesDeclaration(variablesVar),
    ...(
      operationsWithVariables
        .map((operationDefinition) => {
          const operationName = nameFromOperation(operationDefinition);

          return [
            variablesHashForOperationDeclaration(variablesVar, operationName),
            ...(
              operationDefinition.variableDefinitions.map((variableAst) => {
                return declareVariableForOperation(variablesVar, operationName, variableAst);
              })
            )
          ];
        })
        .reduce((acc, variablesStatements) => {
          return acc.concat(variablesStatements);
        }, [])
    )
  ];

}
