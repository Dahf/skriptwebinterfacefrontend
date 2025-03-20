import React, { useEffect, useState } from "react";
import axios from "axios";

interface Skript {
  filename: string;
  content: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [scripts, setScripts] = useState<Skript[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

  // 📌 1. Registrierung (bekommt `verify_code`)
  const handleRegister = async () => {
    try {
      const res = await axios.post("http://mcskript-backend:3000/register", {
        username,
        password,
      });
      setVerifyCode(res.data.verifyCode);
      alert(
        `Registrierung erfolgreich! Verifiziere dich mit /verify ${res.data.verifyCode}`
      );
    } catch (err) {
      console.error("❌ Registrierung fehlgeschlagen:", err);
    }
  };

  // 📌 2. Login (nach Verifizierung)
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://mcskript-backend:3000/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      loadScripts();
    } catch (err) {
      console.error("❌ Login fehlgeschlagen:", err);
      alert("Login fehlgeschlagen! Hast du dich in Minecraft verifiziert?");
    }
  };

  // 📌 3. Skripte laden
  const loadScripts = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://mcskript-backend:3000/scripts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScripts(res.data.scripts);
    } catch (err) {
      console.error("❌ Fehler beim Laden der Skripte:", err);
    }
  };

  // 📌 4. Skript auswählen & in Editor laden
  const openFile = (filename: string) => {
    const file = scripts.find((script) => script.filename === filename);
    if (file) {
      setSelectedFile(filename);
      setFileContent(file.content);
    }
  };

  // 📌 5. Skript speichern
  const saveFile = async () => {
    if (!selectedFile || !token) return;

    try {
      await axios.post(
        "http://mcskript-backend:3000/scripts",
        { filename: selectedFile, content: fileContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Skript gespeichert!");
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
    }
  };

  // 📌 6. Neues Skript erstellen
  const createNewFile = () => {
    const filename = prompt("Neuer Dateiname (z.B. mein_script.sk):");
    if (!filename) return;

    setScripts([...scripts, { filename, content: "" }]);
    setSelectedFile(filename);
    setFileContent("");
  };

  // 📌 7. Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      loadScripts();
    }
  }, [token]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {!token ? (
        <div style={{ margin: "auto", textAlign: "center" }}>
          <h2>🔑 Registrierung & Login</h2>
          <input
            type="text"
            placeholder="Minecraft-Name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Passwort"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>➕ Registrieren</button>
          <button onClick={handleLogin}>➡️ Login</button>

          {verifyCode && (
            <p>
              Dein Code: <strong>{verifyCode}</strong>
              <br /> 📌 Gebe <code>/verify {verifyCode}</code> im
              Minecraft-Server ein!
            </p>
          )}
        </div>
      ) : (
        <>
          {/* 📂 Dateimanager links */}
          <div style={{ width: "30%", background: "#f4f4f4", padding: "10px" }}>
            <h3>📂 Deine Skripte</h3>
            <button onClick={createNewFile}>➕ Neues Skript</button>
            <button onClick={logout}>🚪 Logout</button>
            <ul>
              {scripts.map((script) => (
                <li
                  key={script.filename}
                  style={{ cursor: "pointer", padding: "5px" }}
                  onClick={() => openFile(script.filename)}
                >
                  {script.filename}
                </li>
              ))}
            </ul>
          </div>

          {/* 📝 Skript-Editor rechts */}
          <div style={{ flexGrow: 1, padding: "10px" }}>
            <h3>📝 Skript Editor</h3>
            {selectedFile ? (
              <>
                <h4>{selectedFile}</h4>
                <textarea
                  style={{ width: "100%", height: "400px" }}
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                />
                <button onClick={saveFile}>💾 Speichern</button>
              </>
            ) : (
              <p>📌 Wähle ein Skript aus oder erstelle ein neues!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
