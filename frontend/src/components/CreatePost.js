import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import styles from './CreatePost.module.css';  // Importando o CSS modular

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");  // Estado para armazenar o nome do autor

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "" || author.trim() === "") return;  // Verifica se o título, conteúdo e autor não estão vazios

    // Adiciona o post ao Firestore com o autor incluído
    await addDoc(collection(db, "posts"), {
      title,
      content,
      author,  // Armazena o autor no Firestore
    });

    window.location.href = "/posts"; // Redireciona para a lista de posts
  };

  return (
    <div className={styles.container}>
      <h1>Criar Post</h1>

      <form onSubmit={handleCreatePost}>
        <input
          className={styles.inputField}
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Autor"
        />
        <input
          className={styles.inputField}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />
        <textarea
          className={styles.textareaField}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conteúdo"
        />
        <div className={styles.submitButtonContainer}>
          <button className={styles.button} type="submit">
            Criar Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
