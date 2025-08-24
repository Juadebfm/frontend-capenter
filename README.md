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
