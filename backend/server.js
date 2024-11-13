const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("./firebaseAdmin");  
const { getFirestore, collection, addDoc, getDocs } = require("firebase-admin/firestore");
const db = getFirestore();  

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware para verificar o token JWT enviado pelo front-end
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send("Acesso negado.");
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;  // Salva os dados do usuário no request para uso posterior
    next();
  } catch (error) {
    res.status(401).send("Token inválido.");
  }
};

// **Endpoints para Posts** (rotas de CRUD de posts)

app.post("/posts", verifyToken, async (req, res) => {
  // Endpoint para criar post (requisição POST)
  const { title, content } = req.body;

  try {
    const postRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      userId: req.user.uid, // Armazena o ID do usuário no post para controle
      createdAt: admin.firestore.Timestamp.now(),  // Adiciona a data de criação
    });
    res.status(201).send("Post criado com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao criar post");
  }
});

app.get("/posts", async (req, res) => {
  // Endpoint para obter posts (requisição GET)
  try {
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const postsList = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(postsList);
  } catch (error) {
    res.status(500).send("Erro ao buscar posts");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
