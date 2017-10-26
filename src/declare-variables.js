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

function variablesDeclaration({variablesVar}) {
  return t.variableDeclaration('const', [
    t.variableDeclarator(variablesVar, t.objectExpression([]))
  ]);
}

function variablesHashForOperationDeclaration(operationName, {variablesVar}) {
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

function declareVariableForOperation(operationName, variableAst, config) {
  return t.expressionStatement(
    t.assignmentExpression(
      '=',
      t.memberExpression(
        t.memberExpression(
          config.variablesVar,
          t.identifier(operationName)
        ),
        t.identifier(variableAst.variable.name.value)
      ),
      constructJSVariableDefinition(variableAst, config)
    )
  );
}

export default function declareVariables(graphqlAst, config) {
  const operationsWithVariables = graphqlAst
    .definitions
    .filter(isOperationDefinition)
    .filter(hasVariables);

  if (!operationsWithVariables.length) {
    return [];
  }

  return [
    variablesDeclaration(config),
    ...(
      operationsWithVariables
        .map((operationDefinition) => {
          const operationName = nameFromOperation(operationDefinition);

          return [
            variablesHashForOperationDeclaration(operationName, config),
            ...(
              operationDefinition.variableDefinitions.map((variableAst) => {
                return declareVariableForOperation(operationName, variableAst, config);
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
