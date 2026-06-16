// Camada de comunicacao com a API REST do back-end.
// O token JWT fica salvo em memoria e e enviado no header Authorization.

// URL do back-end. Pode ser sobrescrita por VITE_API_URL.
// Aponta direto para a porta 3333 (o back tem CORS liberado).
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3333/api";

let token = null;

export function definirToken(novoToken) {
  token = novoToken;
}

async function request(caminho, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let resp;
  try {
    resp = await fetch(`${BASE}${caminho}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique se o back-end está rodando na porta 3333.");
  }

  if (resp.status === 204) return null;

  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(dados.erro || `Erro na requisição (${resp.status}).`);
  }
  return dados;
}

export const api = {
  get: (caminho, opts) => request(caminho, { ...opts, method: "GET" }),
  post: (caminho, body, opts) => request(caminho, { ...opts, method: "POST", body }),
  put: (caminho, body, opts) => request(caminho, { ...opts, method: "PUT", body }),
  delete: (caminho, opts) => request(caminho, { ...opts, method: "DELETE" }),
};
