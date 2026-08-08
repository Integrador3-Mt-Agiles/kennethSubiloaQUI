import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";
function Login() {
    const [correo, setCorreo] = useState(""); const [password, setPassword] = useState(""); const navigate = useNavigate();
    const iniciarSesion = async (e) => { e.preventDefault(); try { const respuesta = await login(correo, password); localStorage.setItem("token", respuesta.token); localStorage.setItem("usuario", JSON.stringify(respuesta.usuario)); alert("Bienvenido."); navigate("/dashboard"); } catch (error) { console.error(error); alert(error.response?.data?.mensaje || error.message); } };
    return <main className="login-page"><section className="login-visual"><div className="brand"><span className="brand-mark">✓</span><span>Sistema de Gestión y Seguimiento de Incidentes y Accidentes</span></div><div><h2>Un entorno más seguro comienza con información oportuna.</h2><p>Registre, consulte y dé seguimiento a los eventos desde un solo lugar.</p></div></section><section className="login-panel"><div className="login-card"><p className="eyebrow">Acceso seguro</p><h1>Bienvenido</h1><p>Ingrese sus credenciales para continuar.</p><form onSubmit={iniciarSesion}><div className="field"><label htmlFor="correo">Correo electrónico</label><input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required placeholder="nombre@empresa.com" /></div><div className="field"><label htmlFor="password">Contraseña</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div><button className="button button-primary" type="submit">Iniciar sesión</button></form></div></section></main>;
}
export default Login;
