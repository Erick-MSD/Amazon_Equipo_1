import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoSvg from "../assets/img/Amazon_logo.svg";

type LoginResponse = {
  token?: string;
  user?: any;
  message?: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setError("Por favor completa email y contraseña.");
      return false;
    }
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);

    const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    try {
      const res = await fetch(`${base}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contraseña: password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setError((data as any).error || (data as any).message || "Error en la autenticación. Revisa tus credenciales.");
        setLoading(false);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      navigate('/');
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <Link to="/">
          <img src={logoSvg} alt="Amazon" className="login-logo" />
        </Link>
      </div>

      <div className="login-container">
        <div className="login-card fade-in">
          <h1>Iniciar sesión</h1>
          <p className="login-subtitle">Entra con tu correo y contraseña</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
              />
              <div className="forgot-password">
                <a href="/forgot-password" className="link-forgot">¿Olvidaste tu contraseña?</a>
              </div>
            </div>

            {error && (
              <div className="error-message slide-down" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="login-divider">
            {/* Aquí el texto “Sign Up” ahora tiene redirección */}
            <span>
              O <Link to="/registro-cliente" className="link-signup">Sign Up</Link>
            </span>
          </div>

          <div className="business-section">
            <h3>Buying for work?</h3>
            {/* Este lleva al registro de vendedor */}
            <Link to="/registro-vendedor" className="link-business">
              Create a free business account
            </Link>
          </div>
        </div>
      </div>

      <footer className="login-page-footer">
        <div className="footer-links">
          <a href="/conditions">Conditions of Use</a>
          <a href="/privacy">Privacy Note</a>
          <a href="/help">Help</a>
        </div>
        <div className="footer-copyright">
          © 1996-2025, Amazon.com, Inc. or its affiliates
        </div>
      </footer>
    </div>
  );
};

export default Login;
