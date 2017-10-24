export default function operationName(definition) {
  return definition.name ? definition.name.value : '__defaultOperation__';
}
