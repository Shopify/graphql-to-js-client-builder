const someOtherDocument = fancyClient.document();
someOtherDocument.addQuery(root => {
  root.add("shop", shop => {
    shop.add("name");
  });
});
