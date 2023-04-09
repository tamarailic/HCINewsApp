import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import { useState, useEffect } from 'react';
import Spinner from '@/components/spinner';
import Error from '@/components/error';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const newsApiKey = 'f0885235e81b407294d7c96b9e3f60a4';

export default function Home() {
  const [filters, setFilters] = useState({ q: '', from: '', to: '', category: '', county: 'us' });

  return (<>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet" />
    </Head>
    <section className={styles.main_container} id='main'>
      <LeftNav filters={filters} setFilters={setFilters} />
      <TopNav filters={filters} setFilters={setFilters} />
      <MainArea filters={filters} />
    </section>
  </>

  )
}

function LeftNav({ filters, setFilters }) {
  return (
    <div className={styles.left_nav}>

    </div>
  );
}

function TopNav({ filters, setFilters }) {
  return (
    <div className={styles.nav_top}>
      <div className={styles.navContents}>
        <div>
          <div>
            <Image src="/HCI_logo1.png" width={120} height={100} alt='News logo'></Image>
          </div>
          <div className={styles.currentDate}>{new Date(Date.now()).toDateString().slice(4, 11)}</div>
        </div>
        <SearchBar />
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className={styles.searchSection}>
      <div className={styles.search}>
        <input type="text" name="search" className={styles.round} placeholder='Search' />
        <div className={styles.imgDiv}>
          <Image src="/images/searchIcon.png" width={24} height={24} alt='search icon' />
        </div>
      </div>
      <div className={`${styles.imgDiv} ${styles.arrowIconBtn}`}>
        <Image src="/images/searchArrowIcon.png" width={32} height={32} alt='search arrow icon' />
      </div>
    </div>
  )
}
function MainArea({ filters }) {
  const [newsToShow, setNewsToShow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [readyToLoadMore, setReadyToLoadMore] = useState(true);

  const getNews = hasAppliedFilters(filters) ? getFilteredNews : getTopNews;
  const { topNews, isLoading, isError } = getNews(filters, currentPage);

  useEffect(() => {
    const procentageOfScrollAfterToLoadNewStories = 90;
    const handleScroll = async () => {
      const scrollPercentage = getScrollPercent();
      if (readyToLoadMore && currentPage <= 4 && scrollPercentage > procentageOfScrollAfterToLoadNewStories) {
        setReadyToLoadMore(false);
        setCurrentPage(currentPage + 1);
        const loadMoreNews = hasAppliedFilters(filters) ? loadMoreFilteredNews : loadMoreTopNews;
        const newStories = await loadMoreNews(currentPage + 1);

        if (newStories != null) {
          const allNews = JSON.parse(JSON.stringify(newsToShow)).concat(newStories['articles']);
          setNewsToShow(allNews.filter(item => item != undefined));
          if (!allNews.includes(undefined)) {
            setReadyToLoadMore(true);
          }
        }
      }
    }
    function getScrollPercent() {
      var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
      return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [newsToShow, currentPage, readyToLoadMore]);

  if (isLoading) return <Spinner />
  if (isError) return <Error />

  if (newsToShow === null) {
    setNewsToShow(topNews['articles']);
  }

  return (
    <>
      {newsToShow !== null &&
        <div className={styles.main_area_container}>
          <h2 className={styles.page_title}>{`${hasAppliedFilters(filters) ? 'For you' : 'Top Stories'}`}</h2>
          <div className={styles.story_grid}>
            {[newsToShow[0]].map(bigStory => <BigStoryCard key={bigStory['title'] || crypto.randomUUID()} story={bigStory} />)}
            {newsToShow.slice(1).map(regularStory => <RegularStoryCard key={regularStory['title'] || crypto.randomUUID()} story={regularStory} />)}
          </div>
        </div>
      }
    </>
  );
}

function getTopNews(filters, page = 1, page_size = 20) {
  const { data, error, isLoading } = useSWR(`https://newsapi.org/v2/top-headlines?language=en&country=${filters['county']}&pageSize=${page_size}&page=${page}&apiKey=${newsApiKey}`, fetcher);

  return {
    topNews: data,
    isLoading,
    isError: error
  }
}

function getFilteredNews(filters, page = 1, page_size = 20) {
  let url = ` https://newsapi.org/v2/everything?language=en&country=${filters['county']}&pageSize=${page_size}&page=${page}`;
  if (filters['q']) url += `&q=${filters['q']}`;
  if (filters['from']) url += `&from=${filters['from']}`;
  if (filters['to']) url += `&to=${filters['to']}`;
  if (filters['category']) url += `&category=${filters['category']}`;
  url += `&apiKey=${newsApiKey}`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    topNews: data,
    isLoading,
    isError: error
  }
}

async function loadMoreTopNews(page = 0, page_size = 20) {
  const moreNews = await fetch(`https://newsapi.org/v2/top-headlines?language=en&pageSize=${page_size}&page=${page}&apiKey=${newsApiKey}`);
  return await moreNews.json();
}

async function loadMoreFilteredNews(page = 0, page_size = 20) {
  let url = ` https://newsapi.org/v2/everything?language=en&country=${filters['county']}&pageSize=${page_size}&page=${page}`;
  if (filters['q']) url += `&q=${filters['q']}`;
  if (filters['from']) url += `&from=${filters['from']}`;
  if (filters['to']) url += `&to=${filters['to']}`;
  if (filters['category']) url += `&category=${filters['category']}`;
  url += `&apiKey=${newsApiKey}`;
  const moreNews = await fetch(url);
  return await moreNews.json();
}

function hasAppliedFilters(filters) {
  const filters_to_skip = ['county']
  for (let filter in filters) {
    if (filters_to_skip.includes(filter)) continue;
    if (filters[filter]) {
      return true;
    }
  }
}

function RegularStoryCard({ story }) {
  return (
    <Link href={`/articles/${story['title']}`} style={{ textDecoration: 'none' }}>
      <div className={styles.regular_story + ' ' + styles.card}>
        <div className={styles.main_story_area}>
          <div className={styles.story_content}>
            <div className={styles.story_source}>{story['source']['name'] || ''}</div>
            <div className={styles.story_title}>{`${story['title'].split(' ').slice(0, 12).join(' ')}`}</div>
          </div>
          <div className={styles.story_image}>
            {story['urlToImage'] ? <Image src={story['urlToImage']} alt={story['title']} width={130} height={130} /> : <Image src="/images/articleImageBackup.jpg" alt={story['title']} width={130} height={130} />}
          </div>
        </div>
        <div className={styles.story_footer}>
          <p>{`${calculatePublishTime(story['publishedAt'])} • ${story['author'] || 'anonymous'}`}</p>
          <p className={styles.read_article_btn}>{'➤'}</p>
        </div>
      </div>
    </Link>
  );
}

function BigStoryCard({ story }) {
  return (
    <div className={styles.big_story + ' ' + styles.card}>
      <Link href={`/articles/${story['title']}`} style={{ textDecoration: 'none' }}>
        <div className={styles.main_story_area}>
          <div className={styles.story_image}>
            {story['urlToImage'] ? <img src={story['urlToImage']} alt={story['title']} /> : <img src="/images/articleImageBackup.jpg" alt={story['title']} />}
          </div>
          <div className={styles.story_content}>
            <div className={styles.story_source}>{story['source']['name'] || ''}</div>
            <div className={styles.story_title}>{story['title']}</div>
          </div>
        </div>
      </Link>
      <div className={styles.story_footer}>
        <p>{`${calculatePublishTime(story['publishedAt'])} • ${story['author'] || 'anonymous'}`}</p>
        <p className={styles.read_article_btn}>{'➤'}</p>
      </div>
    </div>
  );
}

function calculatePublishTime(publishedDate) {
  const [date, time] = publishedDate.split('Z')[0].split('T');
  const [year, month, day] = date.split('-');
  const [hours, minutes, seconds] = time.split(':');

  const now = new Date();

  if (year != now.getFullYear()) {
    return +now.getFullYear() - +year + 'year(s) ago';
  }
  if (month != now.getMonth() + 1) {
    return +now.getMonth() + 1 - +month + 'month(s) ago';
  }
  if (+day.split('0')[1] + 1 != now.getDate()) {
    return +now.getDate() - +day + 'day(s) ago';
  }
  if (hours != now.getHours()) {
    return +now.getHours() - +hours + 'hour(s) ago';
  }
  if (minutes != now.getMinutes()) {
    return +now.getMinutes() - +minutes + 'minute(s) ago';
  }
  if (seconds != now.getSeconds()) {
    return +now.getSeconds() - +seconds + 'second(s) ago';
  }
}
