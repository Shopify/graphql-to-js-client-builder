import * as t from 'babel-types';
import parseArgValue from './arg-value-to-js';

export default function parseArg(argument, clientVar) {
  const argumentVar = t.identifier(argument.name.value);
  let argumentDefinition;

  if (argument.value.value) {
    // Scalar or Enum arg value
    argumentDefinition = t.objectProperty(argumentVar, parseArgValue(argument.value, clientVar));
  } else if (argument.value.fields) {
    // Object arg value
    const objectProperties = argument.value.fields.map((field) => parseArg(field, clientVar));

    argumentDefinition = t.objectProperty(argumentVar, t.objectExpression(objectProperties));
  } else {
    argumentDefinition = t.objectProperty(argumentVar, t.callExpression(
      t.memberExpression(clientVar, t.identifier('variable')),
      [t.stringLiteral(argument.value.name.value)]
    ));
  }

  return argumentDefinition;
}
