import * as t from 'babel-types';

export default function argValueToJS(argumentValue, clientVar) {
  switch (argumentValue.kind) {
    case 'StringValue':
      return t.stringLiteral(argumentValue.value);
    case 'EnumValue':
      return t.callExpression(
        t.memberExpression(clientVar, t.identifier('enum')),
        [t.stringLiteral(argumentValue.value)]
      );
    case 'IntValue':
      return t.numericLiteral(parseInt(argumentValue.value, 10));
    case 'FloatValue':
      return t.numericLiteral(parseFloat(argumentValue.value));
    case 'BooleanValue':
      return t.booleanLiteral(argumentValue.value);
    default:
      throw Error(`Unrecognized type "${argumentValue.kind}"`);
  }
}
