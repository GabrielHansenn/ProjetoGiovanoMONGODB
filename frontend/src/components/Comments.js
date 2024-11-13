import { useState, useEffect } from "react";
import { db } from "../firebase";  // Certifique-se de que o db está sendo importado corretamente
import { collection, getDocs, addDoc, query, where, doc, getDoc, updateDoc } from "firebase/firestore";  // Correção da importação
import styles from './Comments.module.css';  // Importando o CSS modular
import { useParams } from "react-router-dom";

const Comments = () => {
  const { postId } = useParams();  // Obtém o ID do post da URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState(""); // Estado para armazenar o nome do usuário
  const [post, setPost] = useState(null);  // Para armazenar os detalhes do post, incluindo o número de curtidas

  // Função para buscar os comentários
  const fetchComments = async () => {
    const commentsCollection = collection(db, "comments");
    const q = query(commentsCollection, where("postId", "==", postId));  // Aqui está a consulta correta para buscar comentários por postId
    const commentsSnapshot = await getDocs(q);  // Pega os documentos filtrados pela query
    const commentsList = commentsSnapshot.docs.map(doc => doc.data());  // Converte os documentos em um array de dados
    setComments(commentsList);  // Atualiza o estado com a lista de comentários
  };

  useEffect(() => {
    // 1. Buscar o post (detalhes do post)
    const fetchPost = async () => {
      const postRef = doc(db, "posts", postId); // Referência para o post
      const postDoc = await getDoc(postRef);  // Usando getDoc, não getDocs, pois é para um único documento
      setPost(postDoc.data());
    };

    // Chama as funções para buscar o post e os comentários
    fetchPost();
    fetchComments();  // Chama a função para buscar os comentários
  }, [postId]);  // Dependência do useEffect: se o postId mudar, o efeito será reexecutado

  // Função para curtir o post e atualizar as curtidas no Firestore
  const handleLike = async (currentLikes) => {
    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        likes: currentLikes + 1, // Incrementa o número de curtidas
      });
    } catch (error) {
      console.error("Erro ao curtir o post: ", error);
    }
  };

  // Função para adicionar um comentário
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "" || userName.trim() === "") return;  // Verifica se o nome e comentário não estão vazios

    // Adiciona um novo comentário ao Firestore
    await addDoc(collection(db, "comments"), {
      postId,
      comment: newComment,
      userName,  // Armazenando o nome do usuário
      createdAt: new Date().toISOString(),
    });

    setNewComment("");  // Limpa o campo de comentário
    fetchComments();  // Chama a função para buscar novamente os comentários atualizados
  };

  // Função para atualizar o nome do usuário
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  if (!post) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={styles.commentContainer}>
      <h1>{post.title}</h1>


      <button
        className={styles.likeButton}
        onClick={() => handleLike(post.likes || 0)}>
        Curtir
      </button>
      <span className={styles.likesCount}>
        {post.likes || 0} Curtidas
      </span>


      <h1 className={styles.commentHeader}>
        Comentários
      </h1>

      {/* Lista de Comentários */}
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div key={index} className={styles.commentText}>
            <p><strong>{comment.userName}</strong>: {comment.comment}</p> {/* Exibe o nome do autor do comentário */}
          </div>
        ))
      ) : (
        <p>Não há comentários para este post.</p>
      )}

      {/* Formulário para adicionar comentário */}
      <form className={styles.formContainer} onSubmit={handleAddComment}>
        <input
          className={styles.inputField}
          type="text"
          value={userName}
          onChange={handleUserNameChange}
          placeholder="Seu nome"
        />
        <textarea
          className={styles.textareaField}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
        />
        <button className={styles.commentButton} type="submit">Adicionar Comentário</button>
      </form>
    </div>
  );
};

export default Comments;
