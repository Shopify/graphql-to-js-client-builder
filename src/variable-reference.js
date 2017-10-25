import * as t from 'babel-types';

export default function variableReference(operationName, variable, variablesVar) {
  return t.memberExpression(
    t.memberExpression(
      variablesVar,
      t.identifier(operationName)
    ),
    t.identifier(variable.name.value)
  );
}
