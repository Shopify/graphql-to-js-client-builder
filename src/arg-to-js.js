import * as t from 'babel-types';
import argValueToJS from './arg-value-to-js';

export default function argsToJS(key, args, clientVar) {
  const argFields = args.map((argument) => {
    return t.objectProperty(t.identifier(argument.name.value), argValueToJS(argument.value, clientVar));
  });

  return t.objectProperty(key, t.objectExpression(argFields));
}
