const document = client.document();
const spreads = {};
const variables = {};
variables.ProductQuery = {};
variables.ProductQuery.id = client.variable("id", "ID!");
variables.ProductQuery.flavor = client.variable("flavor", "FlavorType");
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
document.addMutation("MyMutation", root => {
  root.add("addProducts", {
    args: {
      products: [{
        name: "a childs bicycle",
        price: 12
      }, {
        name: "epoxied banana peel"
      }]
    }
  }, addProducts => {
    addProducts.add("newProducts", newProducts => {
      newProducts.add("title");
      newProducts.add("price");
    });
  });
});
document.addQuery("ProductQuery", [variables.ProductQuery.id, variables.ProductQuery.flavor], root => {
  root.add("node", {
    args: {
      id: variables.ProductQuery.id,
      flavor: variables.ProductQuery.flavor
    }
  }, node => {
    node.addFragment(spreads.ProductFragment);
  });
});
