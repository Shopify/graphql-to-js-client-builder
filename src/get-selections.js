import * as t from 'babel-types';
import parseArg from './parse-arg';

function identifyOperation(selection, spreadsVar) {
  switch (selection.kind) {
    case 'Field':
      return {
        selectionConstructionArgs: [t.stringLiteral(selection.name.value)],
        operationMethodName: 'add',
        kind: 'Field'
      };
    case 'InlineFragment':
      return {
        selectionConstructionArgs: [t.stringLiteral(selection.typeCondition.name.value)],
        operationMethodName: 'addInlineFragmentOn',
        kind: 'InlineFragment'
      };
    default:
      return {
        selectionConstructionArgs: [t.memberExpression(spreadsVar, t.identifier(selection.name.value))],
        operationMethodName: 'addFragment',
        kind: 'Fragment'
      };
  }
}

function applyAlias(options, selection) {
  if (selection.alias) {
    options.push(t.objectProperty(t.identifier('alias'), t.stringLiteral(selection.alias.value)));
  }
}

function applyArguments(options, selection, clientVar) {
  if (!(selection.arguments && selection.arguments.length)) {
    return;
  }

  const fieldArguments = selection.arguments.map((argument) => {
    return parseArg(argument, clientVar);
  });

  options.push(t.objectProperty(t.identifier('selectionConstructionArgs'), t.objectExpression(fieldArguments)));
}

// Returns the body of the block statement representing the selections
export default function getSelections(selectionSet, parentSelectionName, spreadsVar, clientVar) {
  const selections = selectionSet.selections.map((selection) => {
    const {selectionConstructionArgs, operationMethodName, kind} = identifyOperation(selection, spreadsVar);
    const fieldOptions = [];

    applyAlias(fieldOptions, selection);
    applyArguments(fieldOptions, selection, clientVar);

    // Add query options (i.e. alias and arguments) to the query
    if (fieldOptions.length) {
      selectionConstructionArgs.push(t.objectExpression(fieldOptions));
    }

    if (['Field', 'InlineFragment'].includes(kind) && selection.selectionSet) {
      const fieldNameOrTypeConstraint = selectionConstructionArgs[0].value;

      selectionConstructionArgs.push(t.arrowFunctionExpression(
        [t.identifier(fieldNameOrTypeConstraint)],
        t.blockStatement(
          getSelections(selection.selectionSet, fieldNameOrTypeConstraint, spreadsVar, clientVar)
        )
      ));
   }

    return t.expressionStatement(
      t.callExpression(
        t.memberExpression(
          t.identifier(parentSelectionName),
          t.identifier(operationMethodName)
        ),
        selectionConstructionArgs
      )
    );
  });

  return selections;
}
