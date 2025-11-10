import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/AgregarProducto.css";
import logoSvg from "../assets/img/Amazon_logo.svg";

const AgregarProducto: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenes, setImagenes] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  
  const handleImageChange = (index: number, value: string) => {
    const newImagenes = [...imagenes];
    newImagenes[index] = value;
    setImagenes(newImagenes);
  };

  
  const addImageField = () => {
    setImagenes([...imagenes, ""]);
  };

  
  const removeImageField = (index: number) => {
    const newImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(newImagenes);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    
    if (!nombre || !precio) {
      setError("Nombre y precio son obligatorios.");
      return;
    }

    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Debes iniciar sesión como vendedor para agregar productos.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      
      const filteredImagenes = imagenes.filter(img => img.trim() !== "");
      
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          descripcion: descripcion || undefined,
          precio: parseFloat(precio),
          stock: parseInt(stock) || 0,
          imagenes: filteredImagenes,
          categoriaId: categoria || undefined,
        }),
      });

      if (response.ok) {
        alert("✅ Producto agregado correctamente");
        // Reset form
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setStock("");
        setCategoria("");
        setImagenes([""]);
        navigate("/");
      } else {
        const data = await response.json();
        setError("❌ Error: " + (data.message || "Error al agregar producto"));
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      setError("⚠️ No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <img src={logoSvg} alt="Amazon Logo" />
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo para el nombre del producto */}
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        {/* Campo para la descripción del producto */}
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />
        {/* Campo para el precio del producto */}
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        {/* Campo para el stock del producto */}
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
        {/* Campo para la categoría del producto */}
        <input
          type="text"
          placeholder="Categoría (opcional)"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        {/* Sección para manejar múltiples URLs de imágenes */}
        <div className="image-fields">
          <label>URLs de Imágenes (opcional):</label>
          {imagenes.map((img, index) => (
            <div key={index} className="image-field">
              <input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
              />
              {imagenes.length > 1 && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeImageField(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-image-btn"
            onClick={addImageField}
          >
            + Agregar Imagen
          </button>
        </div>

        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Botón para enviar el formulario */}
        <button type="submit" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
};

export default AgregarProducto;
