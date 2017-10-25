import {parse} from 'graphql/language';
import * as t from 'babel-types';
import generate from 'babel-generator';
import documentToJSAst from './document-to-js-ast';

const defaults = {
  clientVar: 'client',
  documentVar: 'document',
  spreadsVar: 'spreads',
  variablesVar: 'variables'
};

export function transformToAst(graphqlCode, {
  clientVar = 'client',
  documentVar = 'document',
  spreadsVar = 'spreads',
  variablesVar = 'variables'
} = defaults) {
  const graphQLAst = parse(graphqlCode);
  const vars = {
    clientVar: t.identifier(clientVar),
    documentVar: t.identifier(documentVar),
    spreadsVar: t.identifier(spreadsVar),
    variablesVar: t.identifier(variablesVar)
  };

  return documentToJSAst(graphQLAst, vars);
}

export default function transformToCode(graphqlCode, {
  clientVar = 'client',
  documentVar = 'document',
  spreadsVar = 'spreads',
  variablesVar = 'variables'
} = defaults) {
  const jsAst = transformToAst(graphqlCode, {
    clientVar,
    documentVar,
    spreadsVar,
    variablesVar
  });

  return `${generate(t.program(jsAst)).code}\n`;
}
