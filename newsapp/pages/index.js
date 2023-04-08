import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import { useState } from 'react';
import Spinner from '@/components/spinner';
import Error from '@/components/error';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const newsApiKey = '339e56b6d42f4a0ab9c4f820c0a35558';

export default function Home() {
  const [filters, setFilters] = useState({ q: '', from: '', to: '', category: '', county: 'us' });

  return (
    <section className={styles.main_container} id='main'>
      <LeftNav filters={filters} setFilters={setFilters} />
      <TopNav filters={filters} setFilters={setFilters} />
      <MainArea filters={filters} />
    </section>
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

    </div>
  );
}

function MainArea({ filters }) {
  const [newsToShow, setNewsToShow] = useState(null);
  const { topNews, isLoading, isError } = getTopNews();

  if (isLoading) return <Spinner />
  if (isError) return <Error />

  if (newsToShow === null) {
    console.log(topNews);
    setNewsToShow(topNews);
  }


  return (<></>);
}

function getTopNews() {
  const { data, error, isLoading } = useSWR(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${newsApiKey}`, fetcher);

  return {
    topNews: data,
    isLoading,
    isError: error
  }
}
