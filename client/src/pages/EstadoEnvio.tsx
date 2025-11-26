import { useEffect, useState } from "react";
import "../assets/css/EstadoEnvio.css";  // ← RUTA CORRECTA

export default function EstadoEnvio() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((res) => res.json())
      .then((data) => setPedidos(data));
  }, []);

  const marcarEnviado = async (id: string) => {
    await fetch(`http://localhost:4000/api/orders/enviar/${id}`, {
      method: "PUT",
    });
    window.location.reload();
  };

  return (
    <div className="envio-container">
      <h1 className="envio-titulo">Estado de Envíos</h1>

      <div className="lista-envios">
        {pedidos.length === 0 ? (
          <p>No hay pedidos por mostrar</p>
        ) : (
          pedidos.map((p: any) => (
            <div key={p._id} className="pedido-card">
              <p><strong>Producto:</strong> {p.productoId}</p>
              <p><strong>Comprador:</strong> {p.compradorId}</p>
              <p><strong>Estado:</strong> {p.estado}</p>

              {p.estado !== "enviado" && (
                <button
                  className="btn-enviar"
                  onClick={() => marcarEnviado(p._id)}
                >
                  Marcar como Enviado
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
