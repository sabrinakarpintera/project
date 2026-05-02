import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style/Shop.css";
import logoImage from "../assets/fuku-logo.png";

export default function Dashboard() {


  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSize, setFilterSize] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    await fetch("http://localhost/Fuku/src/api/logout.php", {
      method: "POST"
    });

    localStorage.removeItem("user"); 
    navigate("/"); 

  } catch (error) {
    console.error("Logout failed:", error);

    localStorage.removeItem("user");
    navigate("/");
  }
};

  
const addToCart = async () => {

  const res = await fetch("http://localhost/Fuku/src/api/add_to_cart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      product_id: selectedProduct.id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    })
  });

  const text = await res.text(); 
  console.log("RAW RESPONSE:", text);

  try {
    const data = JSON.parse(text);
    alert(data.message);
  } catch {
    alert("Invalid JSON response");
  }
};

 useEffect(() => {
    fetch("http://localhost/Fuku/src/api/get_products.php")
      .then((res) => res.json())
      .then((data) => {
        const parsed = data.map(p => ({
          ...p,
          sizes: typeof p.sizes === "string" ? JSON.parse(p.sizes) : p.sizes,
          colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors
        }));
        setProducts(parsed);
      });
  }, []);


    const filteredProducts = products.filter((product) => {

    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === "ALL" || product.category === category;

    const matchSize =
      !filterSize || product.sizes?.includes(filterSize);

    const matchColor =
      !filterColor || product.colors?.includes(filterColor);

    const matchPrice =
      (!minPrice || product.price >= minPrice) &&
      (!maxPrice || product.price <= maxPrice);

    return matchSearch && matchCategory && matchSize && matchColor && matchPrice;
  });

  return (
    <>
    
      <div className="page-wrapper">
        <div className="shop-container">

          <div className="shop-header">

            <div className="profile-wrapper">
              <div className="profile-icon" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="material-symbols-outlined">account_circle</span>
              </div>

              {menuOpen && (
                <div className="menu">
                  <p onClick={() => navigate("/dashboard")}>Home</p>
                  <p onClick={() => navigate("/ordermanagement")}>Orders</p>
                  <p onClick={() => navigate("/myaccount")}>Settings</p>
                  <p onClick={handleLogout}>Log Out</p>
                </div>
              )}
            </div>

            <div className="logo">
              <img src={logoImage} alt="Fuku Logo" />
            </div>

            <div className="cart-icon" onClick={() => navigate("/mycart")}>
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
          </div>

         <div className="browse">

          <div className="search-row">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-group" onClick={() => setFilterOpen(!filterOpen)}>
              <span className="material-symbols-outlined">filter_list</span>
            </div>
          </div>

          {filterOpen && (
            <div className="filter">
              <label>Size</label>
              <input onChange={(e) => setFilterSize(e.target.value)} />

              <label>Color</label>
              <input onChange={(e) => setFilterColor(e.target.value)} />

              <label>Price</label>
              <input type="number" placeholder="min" onChange={(e) => setMinPrice(e.target.value)} />

              <label>—</label>
              <input type="number" placeholder="max" onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          )}

          <div className="category">
            <button onClick={() => setCategory("ALL")}>All</button>
            <button onClick={() => setCategory("MEN")}>Men</button>
            <button onClick={() => setCategory("WOMEN")}>Women</button>
            <button onClick={() => setCategory("KIDS")}>Kids</button>
          </div>

        </div>
                    
          <div className="products">

            {filteredProducts.length === 0 ? (
              <p style={{ textAlign: "center" }}>No products yet.</p>
            ) : (
              filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>

                  <div className="product-image-wrapper">

                    <img
                      src={`http://localhost/Fuku/src/api/${product.image}`}
                      alt={product.name}
                    />

                    <button
                      className="add-to-cart-btn"
                      onClick={() => {
                        setSelectedProduct(product);
                        setQuantity(1);
                        setSelectedSize("");
                        setSelectedColor("");
                      }}
                    >
                      Add to Cart
                    </button>

                  </div>

                  <div className="product-info">

                    <h4>{product.name}</h4>

                    <p>₱{product.price}</p>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

        <footer className="footer">
          <p>© 2026 Fuku. All rights reserved.</p>
        </footer>

      </div>

      
        {selectedProduct && (
          <div className="modal_overlay">
            <div className="modal1">

              <button className="close-btn" onClick={() => setSelectedProduct(null)}>✕</button>

              <div className="modal_content">

                <div className="modal_product">

                  <div className="modal_image_box">
                    <img
                      src={`http://localhost/Fuku/src/api/${selectedProduct.image}`}
                      alt={selectedProduct.name}
                    />
                  </div>

                  <p className="modal_stocks">Stocks: {selectedProduct.quantity}</p>
                  <h2>{selectedProduct.name}</h2>
                  <p className="price">₱{selectedProduct.price}</p>

                </div>

                <div className="modal_details">

                  <label className="modal_label">Description</label>
                  <div className="modal_description">{selectedProduct.description}</div>

                  <label className="modal_label">Sizes</label>
                  <div className="pill-group">
                    {selectedProduct.sizes?.map((size, index) => (
                      <button
                        key={index}
                        className={`pill ${selectedSize === size ? "pill-active" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <label className="modal_label">Colors</label>
                  <div className="pill-group">
                    {selectedProduct.colors?.map((color, index) => (
                      <button
                        key={index}
                        className={`pill ${selectedColor === color ? "pill-active" : ""}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}

                  </div>
                    <label className="modal_label">Quantity</label>
                    <div className="pill-group">
                  <div className="quantity1">
                      <input
                        type="number"
                        value={quantity}
                        min="1"
                        max={selectedProduct.quantity}
                        onChange={(e) => {
                          const value = Number(e.target.value);

                          if (value < 1) {
                            setQuantity(1);
                          } else if (value > selectedProduct.quantity) {
                            setQuantity(selectedProduct.quantity);
                          } else {
                            setQuantity(value);
                          }
                        }}
                      />
                    </div>
                    </div>

                  <div className="modal-actions">
                   <button
                      className="confirm-add"
                      onClick={addToCart}
                      disabled={!selectedSize || !selectedColor}
                    >Add to Cart</button>
                    <button className="buy-now-btn">Buy Now</button>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

    </>
  );
}