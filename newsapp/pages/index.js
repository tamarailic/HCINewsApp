import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import { useState } from 'react';
import Spinner from '@/components/spinner';
import Error from '@/components/error';
import Image from 'next/image';
import Head from 'next/head';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const newsApiKey = '339e56b6d42f4a0ab9c4f820c0a35558';

export default function Home() {
  const [filters, setFilters] = useState({ q: '', from: '', to: '', category: '', county: 'us' });

  return (<>
            <Head>
              <link rel="preconnect" href="https://fonts.googleapis.com"/>
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
              <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet"/>
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
                <div className={styles.currentDate}>{new Date(Date.now()).toDateString().slice(4,11)}</div>
              </div>
              <SearchBar/>
            </div>
          </div>
  );
}

function SearchBar(){
  return (
  <div className={styles.search}>
    <input type="text" name="search" className={styles.round} placeholder='Search' />
    <div className={styles.imgDiv}>
      <Image src="/images/searchIcon.png" width={24} height={24} alt='search icon'/>
    </div>
  </div>)
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
