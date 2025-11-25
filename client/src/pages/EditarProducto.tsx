import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import logoSvg from '../assets/img/Amazon_logo.svg'
import '../assets/css/AgregarProducto.css'

interface ProductData {
  nombre: string
  descripcion: string
  precio: number
  precioOriginal?: number
  stock: number
  categoria: string
  imagenes: string[]
  descuento?: {
    porcentaje: number
    fechaInicio: string
    fechaFin: string
    activo: boolean
  }
}

const EditarProducto: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [product, setProduct] = useState<ProductData>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagenes: []
  })
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [porcentajeDescuento, setPorcentajeDescuento] = useState<number>(0)
  const [fechaInicioDescuento, setFechaInicioDescuento] = useState<string>('')
  const [fechaFinDescuento, setFechaFinDescuento] = useState<string>('')
  const [precioCalculado, setPrecioCalculado] = useState<number>(0)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Cargar producto existente
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Debes iniciar sesión')
          navigate('/login')
          return
        }

        const response = await fetch(`${API_URL}/api/products?limit=1000`)
        const data = await response.json()
        const foundProduct = data.items.find((p: any) => p._id === id)

        if (!foundProduct) {
          alert('Producto no encontrado')
          navigate('/home-vendedor')
          return
        }

        // Verificar que el producto pertenece al vendedor actual
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          if (foundProduct.vendedorId !== user.id) {
            alert('No tienes permiso para editar este producto')
            navigate('/home-vendedor')
            return
          }
        }

        setProduct({
          nombre: foundProduct.nombre || '',
          descripcion: foundProduct.descripcion || '',
          precio: foundProduct.precio || 0,
          precioOriginal: foundProduct.precioOriginal,
          stock: foundProduct.stock || 0,
          categoria: foundProduct.categoria || '',
          imagenes: foundProduct.imagenes || [],
          descuento: foundProduct.descuento
        })

        // Si tiene descuento activo, cargar los datos
        if (foundProduct.descuento?.activo) {
          setPorcentajeDescuento(foundProduct.descuento.porcentaje)
          setFechaInicioDescuento(foundProduct.descuento.fechaInicio?.split('T')[0] || '')
          setFechaFinDescuento(foundProduct.descuento.fechaFin?.split('T')[0] || '')
          setPrecioCalculado(foundProduct.precio)
        } else {
          setPrecioCalculado(foundProduct.precio)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching product:', err)
        alert('Error al cargar el producto')
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  // Calcular precio con descuento
  useEffect(() => {
    if (porcentajeDescuento > 0 && porcentajeDescuento <= 100) {
      const precioBase = product.precioOriginal || product.precio
      const descuento = precioBase * (porcentajeDescuento / 100)
      setPrecioCalculado(precioBase - descuento)
    } else {
      setPrecioCalculado(product.precioOriginal || product.precio)
    }
  }, [porcentajeDescuento, product.precio, product.precioOriginal])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    setNewImages(prev => [...prev, ...fileArray])

    // Crear previews
    fileArray.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }))
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!product.nombre || product.precio <= 0) {
      alert('Nombre y precio son requeridos')
      return
    }

    try {
      setUploading(true)
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Debes iniciar sesión')
        navigate('/login')
        return
      }

      console.log('📝 Actualizando producto...')

      // Subir nuevas imágenes si hay
      let uploadedUrls: string[] = []
      if (newImages.length > 0) {
        console.log('📤 Subiendo nuevas imágenes...')
        const formData = new FormData()
        newImages.forEach(file => {
          formData.append('images', file)
        })

        const uploadResponse = await fetch(`${API_URL}/api/upload/multiple`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Error al subir imágenes')
        }

        const uploadData = await uploadResponse.json()
        uploadedUrls = uploadData.urls
        console.log('✅ Imágenes subidas:', uploadedUrls)
      }

      // Combinar imágenes existentes con nuevas
      const allImages = [...product.imagenes, ...uploadedUrls]

      // Preparar datos del producto
      const productData: any = {
        nombre: product.nombre,
        descripcion: product.descripcion,
        stock: Number(product.stock),
        categoria: product.categoria,
        imagenes: allImages
      }

      // Si hay descuento, enviar datos del descuento
      if (porcentajeDescuento > 0) {
        productData.porcentajeDescuento = porcentajeDescuento
        productData.fechaInicioDescuento = fechaInicioDescuento || new Date().toISOString()
        productData.fechaFinDescuento = fechaFinDescuento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      } else if (porcentajeDescuento === 0) {
        // Si se quitó el descuento
        productData.porcentajeDescuento = 0
        productData.precio = product.precioOriginal || product.precio
      } else {
        // Si no hay cambio en descuento, enviar precio normal
        productData.precio = product.precio
      }

      console.log('📦 Enviando actualización:', productData)

      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar producto')
      }

      const updatedProduct = await response.json()
      console.log('✅ Producto actualizado:', updatedProduct)

      alert('Producto actualizado exitosamente')
      navigate('/home-vendedor')
    } catch (err) {
      console.error('❌ Error:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Error al actualizar producto'}`)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Cargando producto...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="amazon-header">
        <div className="amazon-header-top">
          <Link to="/home-vendedor" className="amazon-logo">
            <img src={logoSvg} alt="Amazon" />
            <span className="amazon-logo-com">.com.mx</span>
          </Link>
          <div className="amazon-deliver">
            <div className="amazon-deliver-line1">Centro de Vendedores</div>
            <div className="amazon-deliver-line2">Editar Producto</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="agregar-producto-container">
        <div className="agregar-producto-card">
          <h1>Editar Producto</h1>
          
          <form onSubmit={handleSubmit} className="agregar-producto-form">
            {/* Información básica */}
            <div className="form-section">
              <h2>Información del Producto</h2>
              
              <div className="form-group">
                <label>Nombre del producto *</label>
                <input
                  type="text"
                  value={product.nombre}
                  onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={product.descripcion}
                  onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={product.categoria}
                  onChange={(e) => setProduct({ ...product, categoria: e.target.value })}
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Juguetes">Juguetes</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Libros">Libros</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Precio y Descuento */}
            <div className="form-section">
              <h2>Precio y Descuento</h2>
              
              <div className="form-group">
                <label>Precio base</label>
                <input
                  type="text"
                  value={`$${(product.precioOriginal || product.precio).toFixed(2)}`}
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#666' }}>
                  Este es el precio original del producto
                </small>
              </div>

              <div className="form-group">
                <label>Descuento (%)</label>
                <input
                  type="number"
                  value={porcentajeDescuento}
                  onChange={(e) => setPorcentajeDescuento(Number(e.target.value))}
                  min="0"
                  max="100"
                  placeholder="0 = sin descuento"
                />
                <small style={{ color: '#666' }}>
                  Ingresa 0 para quitar el descuento
                </small>
              </div>

              {porcentajeDescuento > 0 && (
                <>
                  <div className="form-group">
                    <label>Fecha de inicio del descuento</label>
                    <input
                      type="date"
                      value={fechaInicioDescuento}
                      onChange={(e) => setFechaInicioDescuento(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Fecha de fin del descuento</label>
                    <input
                      type="date"
                      value={fechaFinDescuento}
                      onChange={(e) => setFechaFinDescuento(e.target.value)}
                    />
                  </div>

                  <div className="precio-preview">
                    <div className="precio-preview-label">Precio con descuento:</div>
                    <div className="precio-preview-value">
                      <span className="precio-original">${(product.precioOriginal || product.precio).toFixed(2)}</span>
                      <span className="precio-descuento">${precioCalculado.toFixed(2)}</span>
                      <span className="ahorro">Ahorras: ${((product.precioOriginal || product.precio) - precioCalculado).toFixed(2)} ({porcentajeDescuento}%)</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Imágenes */}
            <div className="form-section">
              <h2>Imágenes del Producto</h2>
              
              {/* Imágenes actuales */}
              {product.imagenes.length > 0 && (
                <div className="form-group">
                  <label>Imágenes actuales</label>
                  <div className="image-preview-grid">
                    {product.imagenes.map((img, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={`${API_URL}${img}`} alt={`Producto ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeExistingImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nuevas imágenes */}
              {imagePreviews.length > 0 && (
                <div className="form-group">
                  <label>Nuevas imágenes a agregar</label>
                  <div className="image-preview-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={preview} alt={`Nueva ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeNewImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Agregar más imágenes</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleImageChange}
                />
                <small style={{ color: '#666' }}>
                  Puedes agregar más imágenes (JPG, PNG)
                </small>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/home-vendedor')}
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={uploading}
              >
                {uploading ? 'Guardando cambios...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarProducto
