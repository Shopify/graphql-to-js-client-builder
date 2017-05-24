import {visit} from 'graphql/language';

// Recursive helper function for sortDefinitions
function visitFragment(fragment, fragments, fragmentsHash) {
  if (fragment.marked) {
    throw Error('Fragments cannot contain a cycle');
  }
  if (!fragment.visited) {
    fragment.marked = true;
    // Visit every spread in this fragment definition
    visit(fragment, {
      FragmentSpread(node) {
        // Visit the corresponding fragment definition
        visitFragment(fragmentsHash[node.name.value], fragments, fragmentsHash);
      }
    });
    fragment.visited = true;
    fragment.marked = false;
    fragments.push(fragment);
  }
}

// Sorts the definitions such that all fragment definitions are before operation
// definitions and fragments definitions are in reverse topological order
export default function sortDefinitions(definitions) {
  const fragments = definitions.filter((definition) => {
    return definition.kind === 'FragmentDefinition';
  });

  // Set up a hash for quick lookup
  const fragmentsHash = {};

  fragments.forEach((fragment) => {
    fragmentsHash[fragment.name.value] = fragment;
  });

  const operations = definitions.filter((definition) => {
    return definition.kind === 'OperationDefinition';
  });

  const sortedFragments = [];

  fragments.forEach((fragment) => {
    if (!fragment.visited) {
      visitFragment(fragment, sortedFragments, fragmentsHash);
    }
  });

  return sortedFragments.concat(operations);
}
