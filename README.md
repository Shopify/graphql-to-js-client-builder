# graphql-to-js-client-builder

This is a generic function that will take in a GraphQL AST, and produce a javascript AST or code representing the query builder syntax used by [graphql-js-client](https://github.com/Shopify/graphql-js-client).

## Table Of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](http://github.com/Shopify/graphql-to-js-client-builder/blob/master/LICENSE.md)

## Installation

```bash
$ yarn add graphql-to-js-client-builder
```

## Usage

There are two ways to use this package. The simplest way is to call the default export from the main package file. It receives GraphQL code, and variable names, and returns javascript. More complex use cases exist, such as integrating the generated code into other code. This requires a function that returns a javascript AST. See both examples below.

### Generating Code

The following example takes GraphQL code, and returns javascript, utilizing `graphql-js-client`'s query builder syntax.

```javascript
import transform from 'graphql-to-js-client-builder';

const code = transform(`
query ($id: ID!) {
  node(id: $id) {
    ... on Product {
      name
      price
    }
  }
}`, 'client', 'document', 'spreads');
```

The above code will generate the following javascript:

```javascript
const document = client.document();

document.addQuery([client.variable('id', 'ID!')], root => {
  root.add("node", {
    args: {
      id: client.variable("ID")
    }
  }, node => {
    node.addFragment('Product', Product => {
      Product.add('name');
      Product.add('price');
    });
  });
});
```

### Generating an AST

The following example takes GraphQL code, and returns a babel AST, utilizing `graphql-js-client`'s query builder syntax.

```javascript
import {transformToAst} from 'graphql-to-js-client-builder';

const ast = transformToAst(`
query ($id: ID!) {
  node(id: $id) {
    ... on Product {
      name
      price
    }
  }
}`, {
  clientVar: 'client',
  documentVar: 'document',
  spreandsVar: 'spreads',
  variablesVar: 'variables'
}
```

The above code would return an AST representing the same javascript code that was shown in the previous example.

## License

MIT, see [LICENSE.md](http://github.com/Shopify/graphql-to js-client-builder/blob/master/LICENSE.md) for details.
