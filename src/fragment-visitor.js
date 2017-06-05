import * as t from 'babel-types';
import getSelections from './get-selections';

export default function fragmentVisitor(jsNodes, clientVar, documentVar, spreadsVar) {
  return function visitor(node) {
    const selectionRootName = 'root';
    const fragmentDefinitionArguments = [
      t.stringLiteral(node.name.value),
      t.stringLiteral(node.typeCondition.name.value),
      getSelections(node.selectionSet, selectionRootName, spreadsVar, clientVar)
    ];

    jsNodes.push(t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(spreadsVar, t.identifier(node.name.value)),
        t.callExpression(
          t.memberExpression(documentVar, t.identifier('defineFragment')),
          fragmentDefinitionArguments
        )
      )
    ));
  };
}
