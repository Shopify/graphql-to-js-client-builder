const someOtherDocument = fancyClient.document();
const variables = {};
someOtherDocument.addQuery(root => {
  root.add("shop", shop => {
    shop.add("name");
  });
});
