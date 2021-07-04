import * as t from 'babel-types';
import argValueToJS from './arg-value-to-js';

export default function directiveToJS(key, args, operationName, config) {
  const directiveFields = args.map((directive) => {
    const argFields = directive.arguments.map((argument) => {
      return t.objectProperty(
        t.identifier(argument.name.value),
        argValueToJS(argument.value, operationName, config)
      );
    });

    return t.objectProperty(
      t.identifier(directive.name.value),
      t.objectExpression(argFields)
    );
  });

  return t.objectProperty(key, t.objectExpression(directiveFields));
}
