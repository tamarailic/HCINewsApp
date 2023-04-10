import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import React, { useState, useEffect, useContext } from 'react';
import Spinner from '@/components/spinner';
import Error from '@/components/error';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { MyAppContext } from './_app';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const newsApiKey = '695130e5e3b84111af647c9f2195a102';

export default function Home() {
  const [filters, setFilters] = useState({ q: '', from: '', to: '', category: '', country: 'us' });
  const [allReporters, setAllReporters] = useState(null);
  const [reporters, setReporters] = useState(null);
  const [isExpended, setIsExpended] = useState(true);

  const { reportersResponse, isLoading, isError } = getReporters();

  if (isLoading) return <Spinner />
  if (isError) return <Error />

  if (allReporters === null) {
    setAllReporters(reportersResponse['sources']);
    const filteredReporters = reportersResponse['sources'].filter(el => el['country'] == filters['country']).map(reporter => reporter['name']);
    setReporters(filteredReporters);
  }

  return (<>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet" />
    </Head>
    <section className={styles.main_container} id='main'>
      <LeftNav filters={filters} setFilters={setFilters} reporters={reporters} isExpended={isExpended} setIsExpended={setIsExpended} />
      <TopNav filters={filters} setFilters={setFilters} setReporters={setReporters} allReporters={allReporters} />
      <MainArea filters={filters} />
    </section>
  </>
  )
}

function LeftNav({ filters, setFilters, reporters, isExpended, setIsExpended }) {
  return (
    <>
      <HamburgerMenu isExpended={isExpended} setIsExpended={setIsExpended} />
      <div className={`${styles.left_nav} ${!isExpended ? styles.hide_nav : null}`}>
        <DatesSection filters={filters} setFilters={setFilters} />
        <CategoriesSection filters={filters} setFilters={setFilters} />
        <ReportersSection filters={filters} setFilters={setFilters} reporters={reporters} />
      </div>
    </>
  );
}

function HamburgerMenu({ isExpended, setIsExpended }) {
  const [isActive, setIsActive] = useState(true);

  function handleHamburgerClick() {
    setIsActive(!isActive);
    setIsExpended(!isExpended)
  }
  return (
    <div className={`${styles.hamburger} ${isActive ? styles.is_active : null}`} onClick={handleHamburgerClick}>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
      <span className={styles.line}></span>
    </div>
  );
}

function DatesSection({ filters, setFilters }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleFromChanged(event) {
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['from'] = event.target.value
    setFrom(event.target.value)
    setFilters(newFilters)
  }

  function handleToChanged(event) {
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['to'] = event.target.value
    setTo(event.target.value)
    setFilters(newFilters)
  }

  function claerFromChanged(event) {
    setFrom("")
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['from'] = '';
    setFilters(newFilters)
  }

  function clearToChanged(event) {
    setTo("")
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['to'] = '';
    setFilters(newFilters)
  }

  return (<>
    <h3 className={styles.datesSectionTitle}>News for period</h3>
    <div className={styles.datesDiv}>
      <h5 className={styles.datesTitle}>From:</h5>
      <div className={styles.dates}>
        <input value={from} type="date" name="from" className={styles.dateInput} onChange={handleFromChanged} />
      </div>
      <div style={{ cursor: "pointer" }} className={styles.categoryIcon} onClick={claerFromChanged}>
        <Image src="/images/cross.png" width={24} height={24} alt="x" />
      </div>
    </div>
    <div className={styles.datesDiv}>
      <h5 className={styles.datesTitle}>Till:</h5>
      <div className={styles.dates}>
        <input value={to} type="date" name="till" className={styles.dateInput} onChange={handleToChanged} />
      </div>
      <div style={{ cursor: "pointer" }} className={styles.categoryIcon} onClick={clearToChanged}>
        <Image src="/images/cross.png" width={24} height={24} alt="x" />
      </div>
    </div></>)
}

function CategoriesSection({ filters, setFilters }) {

  return (<>
    <h2 className={styles.categoriesTitle}>Categories</h2>
    <hr className={styles.breakLine} />
    <div>
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #007AFF", backgroundColor: "#007AFF" }} imageUrl="/images/generalCategory.png" title="General" />
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #FF0053", backgroundColor: "#FF0053" }} imageUrl="/images/healthCategory.png" title="Health" />
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #68CC45", backgroundColor: "#68CC45" }} imageUrl="/images/sportsCategory.png" title="Sports" />
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #AC39FF", backgroundColor: "#AC39FF" }} imageUrl="/images/entertainmentCategory.png" title="Entertainment" />
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #007AFF", backgroundColor: "#007AFF" }} imageUrl="/images/scienceCategory.png" title="Science" />
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #68CC45", backgroundColor: "#68CC45" }} imageUrl="/images/businessCategory.png" title="Business" />
      <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{ border: "0.063rem solid #AC39FF", backgroundColor: "#AC39FF" }} imageUrl="/images/techCategory.png" title="Technology" />
    </div>
  </>)
}

function CategoryCard({ cardStyle, imageUrl, title, filters, setFilters }) {
  function handleCategoryChange() {
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['category'] = title.toLowerCase()
    setFilters(newFilters)
  }

  return (<div className={styles.categoryCard} onClick={handleCategoryChange}>
    <div style={cardStyle} className={styles.categoryIcon} >
      <Image src={imageUrl} width={18} height={18} alt={title} />
    </div>
    <h4 className={styles.categoryIconTitle}>{title}</h4>
  </div>)
}

function ReportersSection({ filters, setFilters, reporters }) {

  return (<>
    <h2 className={styles.categoriesTitle}>Top reporters in your country</h2>
    <hr className={styles.breakLine} />
    <div>
      {reporters.map(r => <ReportCard filters={filters} setFilters={setFilters} key={r} cardStyle={{ border: "0.063rem solid #007AFF", backgroundColor: "#007AFF" }} title={r} />)}
    </div>
  </>)
}

function ReportCard({ cardStyle, title, filters, setFilters }) {
  function handleReporter() {
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['q'] = title
    setFilters(newFilters)
  }

  return (<div className={styles.categoryCard} onClick={handleReporter}>
    <div style={cardStyle} className={styles.categoryIconDiv}>
      <h3 className={styles.letterIcon}>{title.slice(0, 1).toUpperCase()}</h3>
    </div>
    <h4 className={styles.categoryIconTitle}>{title}</h4>
  </div>)
}

function getReporters() {
  const { data, error, isLoading } = useSWR(`https://newsapi.org/v2/top-headlines/sources?apiKey=${newsApiKey}`, fetcher);

  return {
    reportersResponse: data,
    isLoading,
    isError: error
  }
}

function TopNav({ filters, setFilters, setReporters, allReporters }) {
  return (
    <div className={styles.nav_top}>
      <div className={styles.navContents}>
        <div>
          <div>
            <Image src="/HCI_logo1.png" width={120} height={100} alt='News logo' />
          </div>
          <div className={styles.currentDate}>{new Date(Date.now()).toDateString().slice(4, 11)}</div>
        </div>
        <SearchBar filters={filters} setFilters={setFilters} />
        <CountryPicker filters={filters} setFilters={setFilters} setReporters={setReporters} allReporters={allReporters} />
      </div>
    </div>
  );
}

function SearchBar({ filters, setFilters }) {
  const [query, setQuery] = useState(null)

  function handleNewQuery(event) {
    setQuery(event.target.value)
  }

  function handleQuerySearched() {
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['q'] = query
    setFilters(newFilters)
  }

  return (
    <div className={styles.searchSection}>
      <div className={styles.search}>
        <input type="text" name="search" className={styles.round} placeholder='Search' onChange={handleNewQuery} />
        <div className={styles.imgDiv}>
          <Image src="/images/searchIcon.png" width={24} height={24} alt='search icon' />
        </div>
      </div>
      <div className={`${styles.imgDiv} ${styles.arrowIconBtn}`} onClick={handleQuerySearched}>
        <Image src="/images/searchArrowIcon.png" width={32} height={32} alt='search arrow icon' />
      </div>
    </div>
  )
}

function CountryPicker({ filters, setFilters, setReporters, allReporters }) {
  return (
    <div className={styles.country}>
      <div className={`${styles.imgDiv}`}>
        <Image src="/images/planet-earth.png" width={24} height={24} alt='planet icon' />
      </div>
      <CountryDropDown filters={filters} setFilters={setFilters} setReporters={setReporters} allReporters={allReporters} />
    </div>
  )
}

function CountryDropDown({ filters, setFilters, setReporters, allReporters }) {
  const countriesNames = [{ name: "Argentina", code: "ar" }, { name: "Australia", code: "au" }, { name: "Austria", code: "at" }, { name: "Belgium", code: "be" }, { name: "Brazil", code: "br" }, { name: "Bulgaria", code: "bg" }, { name: "Canada", code: "ca" }, { name: "China", code: "cn" }, { name: "Colombia", code: "co" },
  { name: "Cuba", code: "cu" }, { name: "Czech Republic", code: "cz" }, { name: "Egypt", code: "eg" }, { name: "France", code: "fr" }, { name: "Germany", code: "de" }, { name: "Greece", code: "gr" }, { name: "Honk Kong", code: "hk" }, { name: "Hungary", code: "hu" }, { name: "India", code: "in" }, { name: "Indonesia", code: "id" }, { name: "Ireland", code: "ie" }, { name: "Israel", code: "il" }, { name: "Italy", code: "it" }, { name: "Japan", code: "jp" }, { name: "Latvia", code: "lv" }, { name: "Lithuania", code: "lt" },
  { name: "Malaysia", code: "my" }, { name: "Mexico", code: "mx" }, { name: "Morocoo", code: "mk" }, { name: "Netherlands", code: "nl" }, { name: "New Zeland", code: "nz" }, { name: "Nigeria", code: "ng" }, { name: "Norway", code: "no" }, { name: "Philippines", code: "ph" }, { name: "Poland", code: "pl" }, { name: "Portugal", code: "pt" }, { name: "Romania", code: "ro" },
  { name: "Russia", code: "ru" }, { name: "Saudi Arabia", code: "sa" }, { name: "Serbia", code: "rs" }, { name: "Singapore", code: "sg" }, { name: "Slovakia", code: "sk" }, { name: "Slovenia", code: "si" }, { name: "South Africa", code: "za" }, { name: "South Korea", code: "kr" }, { name: "Sweden", code: "se" },
  { name: "Switzerland", code: "sw" }, { name: "Taiwan", code: "tw" }, { name: "Thailand", code: "th" }, { name: "Turkey", code: "tr" }, { name: "UAE", code: "ae" }, { name: "Ukraine", code: "ua" }, { name: "UK", code: "gb" }, { name: "US", code: "us" }, { name: "Venuzuela", code: "Ve" }];

  function handleChange(event) {
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['country'] = event.target.value
    setFilters(newFilters)
    const filteredReporters = allReporters.filter(el => el['country'] == event.target.value).map(reporter => reporter['name']);
    setReporters(filteredReporters)
  }

  return (<select type="text" name="countries" className={styles.round} value={filters['country']} onChange={handleChange}>
    {countriesNames.map(c => <option key={c['code']} value={c['code']}>{c['name']}</option>)}
  </select>)
}


function MainArea({ filters }) {
  const { myGlobalData, setMyGlobalData } = useContext(MyAppContext);
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
        const newStories = await loadMoreNews(filters, currentPage + 1);

        if (newStories != null) {
          const allNews = JSON.parse(JSON.stringify(newsToShow)).concat(newStories['articles']);
          setNewsToShow(allNews.filter(item => item != undefined));
          if (!allNews.includes(undefined) && newStories['totalResults'] != allNews.length) {
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
    if (topNews['totalResults'] <= topNews['articles'].length) {
      setReadyToLoadMore(false);
    }
  }

  return (
    <>
      {newsToShow !== null &&
        <div className={styles.main_area_container}>
          <h2 className={styles.page_title}>{`${hasAppliedFilters(filters) ? 'For you' : 'Top Stories'}`}</h2>
          <div className={styles.story_grid}>
            {[newsToShow[0]].map(bigStory => <BigStoryCard passValue={setMyGlobalData} key={bigStory['title'] || crypto.randomUUID()} story={bigStory} />)}
            {newsToShow.slice(1).map(regularStory => <RegularStoryCard passValue={setMyGlobalData} key={regularStory['title'] || crypto.randomUUID()} story={regularStory} />)}
          </div>
        </div>
      }
    </>
  );
}

function RegularStoryCard({ story, passValue }) {
  return (
    <Link onClick={() => passValue(story)} href={'/articles'} style={{ textDecoration: 'none' }}>
      <div className={styles.regular_story + ' ' + styles.card}>
        <div className={styles.main_story_area}>
          <div className={styles.story_content}>
            <div className={styles.story_source}>{story['source']['name'] || ''}</div>
            <div className={styles.story_title}>{`${story['title'].split(' ').slice(0, 9).join(' ')}`}</div>
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

function BigStoryCard({ story, passValue }) {
  return (
    <div className={styles.big_story + ' ' + styles.card}>
      <Link onClick={() => passValue(story)} href={'/articles'} style={{ textDecoration: 'none' }}>
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

function getTopNews(filters, page = 1, page_size = 20) {
  const { data, error, isLoading } = useSWR(`https://newsapi.org/v2/top-headlines?language=en&country=${filters['country']}&pageSize=${page_size}&page=${page}&apiKey=${newsApiKey}`, fetcher);

  return {
    topNews: data,
    isLoading,
    isError: error
  }
}

function getFilteredNews(filters, page = 1, page_size = 20) {
  let url = ` https://newsapi.org/v2/everything?language=en&pageSize=${page_size}&page=${page}`;
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

async function loadMoreTopNews(filters, page = 1, page_size = 20) {
  const moreNews = await fetch(`https://newsapi.org/v2/top-headlines?language=en&country=${filters['country']}&pageSize=${page_size}&page=${page}&apiKey=${newsApiKey}`);
  return await moreNews.json();
}

async function loadMoreFilteredNews(filters, page = 1, page_size = 20) {
  let url = ` https://newsapi.org/v2/everything?language=en&pageSize=${page_size}&page=${page}`;
  if (filters['q']) url += `&q=${filters['q']}`;
  if (filters['from']) url += `&from=${filters['from']}`;
  if (filters['to']) url += `&to=${filters['to']}`;
  if (filters['category']) url += `&category=${filters['category']}`;
  url += `&apiKey=${newsApiKey}`;
  const moreNews = await fetch(url);
  return await moreNews.json();
}

function hasAppliedFilters(filters) {
  const filters_to_skip = ['country']
  for (let filter in filters) {
    if (filters_to_skip.includes(filter)) continue;
    if (filters[filter]) {
      return true;
    }
  }
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
