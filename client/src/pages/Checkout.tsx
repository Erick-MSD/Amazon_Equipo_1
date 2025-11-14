import React from "react";

export default function Checkout() {
  const direccion = localStorage.getItem("direccion_envio") || "Sin dirección";

  return (
    <div style={{ padding: "40px" }}>
      <h1>Checkout</h1>

      <p><strong>Dirección de envío:</strong> {direccion}</p>

      <p>Aquí tus compañeros agregarán el resumen del carrito y el pago más adelante.</p>
    </div>
  );
}
