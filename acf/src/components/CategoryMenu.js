import React from "react";

const CategoryMenu = ({ categories, setSelectedCategory }) => {
  return (
    <aside className="sidebar">
      <h3>Categorías</h3>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategoryMenu;
