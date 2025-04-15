export const handleLike = async (productId, likedProducts, setLikedProducts, navigate) => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("Debes iniciar sesión para dar me gusta.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        let updatedLikes;
        if (likedProducts.includes(productId)) {
          updatedLikes = likedProducts.filter((id) => id !== productId);
        } else {
          updatedLikes = [...likedProducts, productId];
          setTimeout(() => {
            if (window.confirm("¿Quieres ver tus Me Gusta?")) {
              navigate("/likes");
            }
          }, 200);
        }
  
        setLikedProducts(updatedLikes);
        localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  