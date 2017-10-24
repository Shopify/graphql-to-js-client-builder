import * as t from 'babel-types';
import argValueToJS from './arg-value-to-js';

function typeConstraint(variableAst) {
  switch (variableAst.kind) {
    case 'NonNullType':
      return `${typeConstraint(variableAst.type)}!`;
    case 'ListType':
      return `[${typeConstraint(variableAst.type)}]`;
    default:
      return variableAst.name.value;
  }
}

export default function constructJSVariableDefinition(variableAst, clientVar, variablesVar) {
  const variableConstructionArgs = [
    t.stringLiteral(variableAst.variable.name.value),
    t.stringLiteral(typeConstraint(variableAst.type))
  ];

  if (variableAst.defaultValue) {
    variableConstructionArgs.push(argValueToJS(variableAst.defaultValue, null, clientVar, variablesVar));
  }

  return t.callExpression(
    t.memberExpression(
      clientVar,
      t.identifier('variable')
    ),
    variableConstructionArgs
  );
}
