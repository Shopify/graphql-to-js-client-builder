import * as t from 'babel-types';
import argValueToJS from './arg-value-to-js';

export default function argToJS(key, args, clientVar, variablesVar) {
  const argFields = args.map((argument) => {
    return t.objectProperty(t.identifier(argument.name.value), argValueToJS(argument.value, clientVar, variablesVar));
  });

  return t.objectProperty(key, t.objectExpression(argFields));
}
