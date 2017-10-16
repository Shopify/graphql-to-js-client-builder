import {parse} from 'graphql/language';
import * as t from 'babel-types';
import generate from 'babel-generator';
import documentToJSAst from './document-to-js-ast';

export function transformToAst(
  graphqlCode,
  clientVar = 'client',
  documentVar = 'document',
  spreadsVar = 'spreads',
  variablesVar = 'variables'
) {
  const graphQLAst = parse(graphqlCode);

  return documentToJSAst(
    graphQLAst,
    t.identifier(clientVar),
    t.identifier(documentVar),
    t.identifier(spreadsVar),
    t.identifier(variablesVar)
  );
}

export default function transformToCode(graphqlCode, clientVar = 'client', documentVar = 'document', spreadsVar = 'spreads') {
  const jsAst = transformToAst(graphqlCode, clientVar, documentVar, spreadsVar);

  return `${generate(t.program(jsAst)).code}\n`;
}
