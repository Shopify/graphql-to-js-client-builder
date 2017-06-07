import {parse} from 'graphql/language';
import * as t from 'babel-types';
import generate from 'babel-generator';
import documentToJSAst from './document-to-js-ast';

export default function transform(graphqlCode, clientVar = 'client', documentVar = 'document', spreadsVar = 'spreads') {
  const graphQLAst = parse(graphqlCode);

  const jsAst = documentToJSAst(graphQLAst, t.identifier(clientVar), t.identifier(documentVar), t.identifier(spreadsVar));

  return `${generate(t.program(jsAst)).code}\n`;
}
