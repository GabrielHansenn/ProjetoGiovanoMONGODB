import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import styles from './Posts.module.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, "posts");
      const postsSnapshot = await getDocs(postsCollection);
      const postsList = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsList);
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        likes: currentLikes + 1,
      });
    } catch (error) {
      console.error("Erro ao curtir o post: ", error);
    }
  };

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <div key={post.id} className={styles.postItem}>
          <p className={styles.postAuthor}><strong>Autor:</strong> {post.author}</p> {/* Exibe o autor */}
          <h3 className={styles.postTitle}>{post.title}</h3>
          <p className={styles.postContent}>{post.content}</p>
          <div className={styles.buttonsContainer}>
            <button
              className={styles.likeButton}
              onClick={() => handleLike(post.id, post.likes || 0)}
            >
              Curtir
            </button>
            <div className={styles.likesAndComments}>
              <span className={styles.likesCount}>{post.likes || 0} curtidas</span><br></br>
              <Link to={`/comments/${post.id}`} className={styles.commentLink}>
                Comentários...
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
