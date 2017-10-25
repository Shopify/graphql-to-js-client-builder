import * as t from 'babel-types';
import argValueToJS from './arg-value-to-js';

export default function argToJS(key, args, operationName, config) {
  const argFields = args.map((argument) => {
    return t.objectProperty(
      t.identifier(argument.name.value),
      argValueToJS(argument.value, operationName, config)
    );
  });

  return t.objectProperty(key, t.objectExpression(argFields));
}
