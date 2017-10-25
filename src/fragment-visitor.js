import * as t from 'babel-types';
import selectionSetToJS from './selection-set-to-js';

export default function fragmentVisitor(jsNodes, config) {
  return function visitor(node) {
    const selectionRootName = 'root';
    const fragmentDefinitionArguments = [
      t.stringLiteral(node.name.value),
      t.stringLiteral(node.typeCondition.name.value),
      selectionSetToJS(node.selectionSet, selectionRootName, null, config)
    ];

    jsNodes.push(t.expressionStatement(
      t.assignmentExpression(
        '=',
        t.memberExpression(config.spreadsVar, t.identifier(node.name.value)),
        t.callExpression(
          t.memberExpression(config.documentVar, t.identifier('defineFragment')),
          fragmentDefinitionArguments
        )
      )
    ));
  };
}
