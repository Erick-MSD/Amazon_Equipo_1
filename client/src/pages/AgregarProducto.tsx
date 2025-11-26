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
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const API_URL = (import.meta as any).env.VITE_API_URL as string;

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Validar que sean JPG o PNG
      const validFiles = filesArray.filter(file => {
        const isValid = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isValid) {
          setError(`${file.name} no es JPG ni PNG`);
        }
        return isValid;
      });
      setImagenes(prev => [...prev, ...validFiles]);
      setError(null);
    }
  };

  
  const removeImage = (index: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
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
      let imageUrls: string[] = [];

      // Subir imágenes si existen
      if (imagenes.length > 0) {
        const formData = new FormData();
        imagenes.forEach(file => {
          formData.append('images', file);
        });

        console.log('📤 Subiendo imágenes al servidor...');

        const uploadResponse = await fetch(`${API_URL}/api/upload/multiple`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Error subiendo imágenes');
        }

        const uploadData = await uploadResponse.json();
        console.log('✅ Imágenes subidas:', uploadData);
        
        // Las URLs ya vienen con /uploads/, solo agregar el dominio si es necesario
        imageUrls = uploadData.urls.map((url: string) => 
          url.startsWith('http') ? url : `${API_URL}${url}`
        );
      }

      console.log('📦 Creando producto con imágenes:', imageUrls);

      // Crear el producto
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
          imagenes: imageUrls,
          categoriaId: categoria || undefined,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('✅ Producto creado:', responseData);
        alert("✅ Producto agregado correctamente");
        // Reset form
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setStock("");
        setCategoria("");
        setImagenes([]);
        navigate("/home-vendedor");
      } else {
        console.error('❌ Error del servidor:', responseData);
        setError("❌ Error: " + (responseData.message || "Error al agregar producto"));
      }
    } catch (error) {
      console.error("❌ Error al conectar con el backend:", error);
      setError("⚠️ " + (error instanceof Error ? error.message : "No se pudo conectar con el servidor"));
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

        {/* Sección para subir imágenes JPG/PNG */}
        <div className="image-fields">
          <label>Imágenes del Producto (JPG o PNG):</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleImageChange}
            className="file-input"
          />
          {imagenes.length > 0 && (
            <div className="image-preview-list">
              {imagenes.map((file, index) => (
                <div key={index} className="image-preview-item">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index}`}
                    className="image-preview-thumb"
                  />
                  <span className="image-preview-name">{file.name}</span>
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
