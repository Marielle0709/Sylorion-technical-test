import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate= useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    
    
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });

      const result = response.data;
      console.log(result);
      if (result.userId) {
        localStorage.setItem("userid",result.userId)
        localStorage.setItem("username",result.username)
        navigate("/factures");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setErrorMessage("Une erreur s'est produite lors de la connexion.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          width: "600px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "75%" }}
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop:"1em",
            marginBottom:"1em"
          }}
        >
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "75%" }}
          />
        </div>

        <button type="button" style={{background:"blue",color:"white",width:"50%",height:"25px",borderRadius:"15px"}} onClick={handleLogin}>
          Connexion
        </button>

        {errorMessage && (
          <p style={{ color: "red", marginBottom: "16px" }}>{errorMessage}</p>
        )}
      </form>
    </div>
  );
};

export default Login;
