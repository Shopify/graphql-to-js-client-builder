const document = client.document();
const spreads = {};
spreads.ProductFragment = document.defineFragment("ProductFragment", "Product", root => {
  root.add("title");
});
spreads.ShopFragment = document.defineFragment("ShopFragment", "Shop", root => {
  root.add("name", {
    alias: "shopName"
  });
  root.add("products", {
    args: {
      first: 10
    }
  }, products => {
    products.add("edges", edges => {
      edges.add("node", node => {
        node.addFragment(spreads.ProductFragment);
      });
    });
  });
});
document.addQuery("MyQuery", root => {
  root.add("shop", shop => {
    shop.addFragment(spreads.ShopFragment);
  });
});
