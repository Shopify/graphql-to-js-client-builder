import * as t from 'babel-types';
import variableReference from './variable-reference';

export default function referenceVariablesInOperationDeclaration(operationName, variableDefinitions, variablesVar) {
  return t.arrayExpression(variableDefinitions.map((variableAst) => {
    return variableReference(operationName, variableAst.variable, variablesVar);
  }));
}
