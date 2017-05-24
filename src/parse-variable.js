import * as t from 'babel-types';
import parseArgValue from './parse-arg-value';

function extractVariableType(variableAst) {
  switch (variableAst.kind) {
    case 'NonNullType':
      return `${extractVariableType(variableAst.type)}!`;
    case 'ListType':
      return `[${extractVariableType(variableAst.type)}]`;
    default:
      // NamedType
      return variableAst.name.value;
  }
}

function assignDefaultValue(variableConstructionArgs, variableAst, clientVar) {
  if (variableAst.defaultValue) {
    variableConstructionArgs.push(parseArgValue(variableAst.defaultValue, clientVar));
  }
}

// Parses a GraphQL AST variable and returns the babel type for the variable in query builder syntax
// variable('first', 'Int!')
export default function parseVariable(variableAst, clientVar) {
  const variableConstructionArgs = [
    t.stringLiteral(variableAst.variable.name.value),
    t.stringLiteral(extractVariableType(variableAst.type))
  ];

  assignDefaultValue(variableConstructionArgs, variableAst, clientVar);

  return t.callExpression(
    t.memberExpression(
      clientVar,
      t.identifier('variable')
    ),
    variableConstructionArgs
  );
}
