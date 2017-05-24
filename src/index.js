import {parse} from 'graphql/language';
import * as t from 'babel-types';
import generate from 'babel-generator';
import documentToJSAst from './document-to-js-ast';

export default function transform(graphqlCode, clientVar = t.identifier('client'), documentVar = t.identifier('document'), spreadsVar = t.identifier('spreads')) {
  const graphQLAst = parse(graphqlCode);

  const jsAst = documentToJSAst(graphQLAst, clientVar, documentVar, spreadsVar);

  return `${generate(t.program(jsAst)).code}\n`;
}
