import * as t from 'babel-types';
import variableReference from './variable-reference';

export default function referenceVariablesInOperationDeclaration(operationName, variableDefinitions, config) {
  return t.arrayExpression(variableDefinitions.map((variableAst) => {
    return variableReference(operationName, variableAst.variable, config);
  }));
}
