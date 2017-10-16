const document = client.document();
const variables = {};
document.addQuery(root => {
  root.add("shop", shop => {
    shop.add("name");
  });
});
