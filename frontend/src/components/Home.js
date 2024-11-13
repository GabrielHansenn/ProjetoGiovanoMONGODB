// src/pages/Home.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Home.module.css';

const Home = () => {
    const [featuredPosts, setFeaturedPosts] = useState([]);
    const [trendingTopics, setTrendingTopics] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        // Função para buscar posts em destaque
        const fetchFeaturedPosts = async () => {
            const postsCollection = collection(db, "posts");
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Aqui você pode filtrar posts em destaque, por exemplo
            setFeaturedPosts(postsList.slice(0, 3)); // Exemplo: os 3 primeiros posts
        };

        // Função para buscar tendências (tags populares)
        const fetchTrendingTopics = async () => {
            // Simulação de tendência (caso tenha um campo de tags no Firestore)
            setTrendingTopics(["#tecnologia", "#cultura", "#esportes", "#inovação"]);
        };

        // Função para buscar posts recentes
        const fetchRecentPosts = async () => {
            const postsCollection = collection(db, "posts");
            const postsSnapshot = await getDocs(postsCollection);
            const postsList = postsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecentPosts(postsList);
        };

        fetchFeaturedPosts();
        fetchTrendingTopics();
        fetchRecentPosts();
    }, []);

    return (
        <div className={styles.container}>
            <section className={styles.featured}>
                <h2>Destaques</h2>
                <div className={styles.featuredPosts}>
                    {featuredPosts.map(post => (
                        <div key={post.id} className={styles.post}>
                            <span><strong>Autor:</strong> {post.author}</span>
                            <h3>{post.title}</h3>
                            <p>{post.content.slice(0, 100)}...</p>
                            <p className={styles.likes}><strong>Curtidas:</strong> {post.likes || 0}</p> {/* Exibe o número de curtidas */}
                            <Link to={`/posts/`}>Leia mais</Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.trending}>
                <h2>Tendências</h2>
                <div className={styles.trendingTopics}>
                    {trendingTopics.map((topic, index) => (
                        <span key={index} className={styles.topic}>
                            {topic}
                        </span>
                    ))}
                </div>
            </section>

            <section className={styles.recentPosts}>
                <h2>Postagens Recentes</h2>
                <div className={styles.postsList}>
                    {recentPosts.map(post => (
                        <div key={post.id} className={styles.postItem}>
                            <h3>{post.title}</h3>
                            <p>{post.content.slice(0, 100)}...</p>
                            <div className={styles.postFooter}>
                                <span><strong>Autor:</strong> {post.author}</span>
                                <Link to={`/posts/`}>Leia mais</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
