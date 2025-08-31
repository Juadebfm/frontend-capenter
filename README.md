```jsx
function getCategories() {
  // Step 1: Collect all categories from the products
  const allCategories = products.map((product) => product.category);

  // Step 2: Remove any empty, null, or undefined values
  const validCategories = allCategories.filter((category) => Boolean(category));

  // Step 3: Keep only the first occurrence of each category (remove duplicates)
  const uniqueCategories = validCategories.filter((category, index, arr) => {
    return arr.indexOf(category) === index;
  });

  // Step 4: Return the result
  return uniqueCategories;
}
```

```jsx
{
  showPrice === product.sku ? (
    <div className="mt-2 bg-gray-100 rounded text-sm">
      <div className="flex items-center space-x-2">
        {/* Current price */}
        <span className="font-bold text-gray-900">${product.price}</span>

        {/* Show original price only if it’s higher (means discount) */}
        {product.originalPrice > product.price ? (
          <span className="line-through text-gray-500">
            ${product.originalPrice}
          </span>
        ) : null}
      </div>
    </div>
  ) : null;
}
```
