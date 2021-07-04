const document = client.document();
const spreads = {};
const variables = {};
variables.ProductQuery = {};
variables.ProductQuery.id = client.variable("id", "ID!");
variables.ProductQuery.flavor = client.variable("flavor", "FlavorType");
variables.ProductQuery.includeId = client.variable("includeId", "Boolean", true);
variables.ProductQuery.skipVariants = client.variable("skipVariants", "Boolean", false);
variables.ProductQuery.dateFormat = client.variable("dateFormat", "String", "YYYY-MM-DD");
spreads.VariantFragment = document.defineFragment("VariantFragment", "Variant", root => {
  root.add("title");
});
document.addQuery("ProductQuery", [variables.ProductQuery.id, variables.ProductQuery.flavor, variables.ProductQuery.includeId, variables.ProductQuery.skipVariants, variables.ProductQuery.dateFormat], root => {
  root.add("product", {
    args: {
      id: variables.ProductQuery.id,
      flavor: variables.ProductQuery.flavor
    }
  }, product => {
    product.add("id", {
      directives: {
        include: {
          if: variables.ProductQuery.includeId
        },
        format: {
          as: "gid"
        },
        upper: {}
      }
    });
    product.add("title", {
      directives: {
        lower: {}
      }
    });
    product.add("price");
    product.add("variants", {
      args: {
        first: 20
      },
      directives: {
        skip: {
          if: variables.ProductQuery.skipVariants
        }
      }
    }, variants => {
      variants.add("edges", edges => {
        edges.add("node", node => {
          node.addFragment(spreads.VariantFragment);
        });
      });
    });
    product.add("createdAt", {
      directives: {
        format: {
          as: variables.ProductQuery.dateFormat
        }
      }
    });
  });
});
