import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { id } = useParams() // ID del producto desde la URL

  const [product, setProduct] = useState<any>(null)
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Cargar datos del producto (solo para mostrarlo)
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err))
  }, [id])

  // Enviar calificación
  const enviarReview = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productoId: id,
          usuarioId: "1234567890abcdef", // ← luego lo conectamos a tu login
          calificacion: estrellas,
          comentario
        })
      })

      const data = await res.json()
      setMensaje("¡Gracias por tu calificación!")
      setComentario('')
      setEstrellas(5)

    } catch (error) {
      console.error(error)
      setMensaje("Error al enviar la calificación")
    }
  }

  if (!product) return <p>Cargando...</p>

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.nombre}</h1>
      <img src={product.imagen} className="w-64 mb-4" />

      <h2 className="text-xl font-semibold mt-6">Calificar producto</h2>

      <form onSubmit={enviarReview} className="mt-4 bg-gray-100 p-4 rounded-lg">
        <label className="block mb-2 font-medium">Estrellas (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={estrellas}
          onChange={(e) => setEstrellas(Number(e.target.value))}
          className="border p-2 w-full"
        />

        <label className="block mt-4 mb-2 font-medium">Comentario</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="border p-2 w-full h-24"
        />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Enviar calificación
        </button>
      </form>

      {mensaje && <p className="mt-3 text-green-600">{mensaje}</p>}
    </div>
  )
}
