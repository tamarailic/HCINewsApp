import styles from '@/styles/Article.module.css'
import React, { useContext } from 'react';
import { MyAppContext } from '../_app';
import Image from 'next/image';
import Link from 'next/link';

export default function Article() {
    const { myGlobalData, setMyGlobalData } = useContext(MyAppContext);
    return (myGlobalData &&
        <>
            <BackArrow />
            <TopSection />
            <StorySection article={myGlobalData} />
        </>
    );
}

function BackArrow() {
    return (<Link href={'/'} className={styles.backArrow}>
        <Image src={'/images/back_arrow.png'} alt='Back' width={30} height={30} />
    </Link>);
}

function TopSection() {
    return (
        <div className={styles.topSection}>
            <div>
                <Image src="/HCI_logo1.png" width={120} height={100} alt='News logo' />
            </div>
        </div>
    );
}

function StorySection({ article }) {

    return (article && <div className={styles.article}>
        <div className={styles.imageContainer}>
            <img src={article['urlToImage']} />
        </div>
        <div><p className={styles.article_date}>{article['publishedAt'] && article['publishedAt'].split('Z')[0].replace('T', ' ')}</p></div>
        <div><h1 className={styles.article_title}>{article['title'] || ''}</h1></div>
        <div className={styles.line}></div>
        <div><h3 className={styles.article_authors}>{`${article['author'] || ''} • ${article['source'] && article['source']['name'] || 'anonymous source'}`}</h3></div>
        <div className={styles.content_cointainer}><span className={styles.article_content}>{`${article['description'] || ''} ${article['content'] && article['content'].split('[')[0]}`}</span><a target='_blank' className={styles.article_link} href={article['url']}>Read more here</a></div>

    </div>);

}