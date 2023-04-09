import styles from '@/styles/Home.module.css'
import useSWR from 'swr'
import { useState } from 'react';
import Spinner from '@/components/spinner';
import Error from '@/components/error';
import useScrollPercentage from '@/components/useScrollProcentage';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const newsApiKey = '695130e5e3b84111af647c9f2195a102';

export default function Home() {
  const [filters, setFilters] = useState({ q: '', from: '', to: '', category: '', country: 'us' });
  const [allReporters, setAllReporters] = useState(null);
  const [reporters, setReporters] = useState(null);

  const { reportersResponse, isLoading, isError } = getReporters();

  if (isLoading) return <Spinner />
  if (isError) return <Error />

  if(allReporters === null){
    setAllReporters(reportersResponse['sources']);
    const filteredReporters = reportersResponse['sources'].filter(el => el['country'] == filters['country']).map(reporter => reporter['name']);
    setReporters(filteredReporters);
  }
  
  return (<>
            <Head>
              <link rel="preconnect" href="https://fonts.googleapis.com"/>
              <link rel="preconnect" href="https://fonts.gstatic.com"/>
              <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet"/>
            </Head>
            <section className={styles.main_container} id='main'>
              <LeftNav filters={filters} setFilters={setFilters} reporters={reporters}/>
              <TopNav filters={filters} setFilters={setFilters} setReporters={setReporters} allReporters={allReporters}/>
              <MainArea filters={filters} />
            </section>
          </>
    
  )
}

function LeftNav({ filters, setFilters,reporters }) {
  return (
    <div className={styles.left_nav}>
      <DatesSection filters={filters} setFilters={setFilters}/>
      <CategoriesSection filters={filters} setFilters={setFilters}/>
      <ReportersSection filters={filters} setFilters={setFilters} reporters={reporters}/>
    </div>
  );
}

function DatesSection({filters, setFilters}){

  function handleFromChanged(event){
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['from'] = event.target.value
    setFilters(newFilters)
  }

  function handleToChanged(event){
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['to'] = event.target.value
    setFilters(newFilters)
  }

  return (<>
  <h3 className={styles.datesTitle}>News for period</h3>
      <div className={styles.datesDiv}>
        <h5 className={styles.datesTitle}>From:</h5>
        <div className={styles.dates}>
          <input type="date" name="from" className={styles.dateInput} onChange={handleFromChanged}/>
        </div>
      </div>
      <div className={styles.datesDiv}>
        <h5 className={styles.datesTitle}>Till:</h5>
        <div className={styles.dates}>
          <input type="date" name="till" className={styles.dateInput} onChange={handleToChanged}/>
        </div>
      </div></>)
}

function CategoriesSection({filters, setFilters}){

  return (<>
  <h2 className={styles.categoriesTitle}>Categories</h2>
      <hr className={styles.breakLine}/>
      <div>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #007AFF",  backgroundColor: "#007AFF"}} imageUrl="/images/generalCategory.png" title="General"/>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #FF0053",  backgroundColor: "#FF0053"}} imageUrl="/images/healthCategory.png" title="Health"/>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #68CC45",  backgroundColor: "#68CC45"}} imageUrl="/images/sportsCategory.png" title="Sports"/>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #AC39FF",  backgroundColor: "#AC39FF"}} imageUrl="/images/entertainmentCategory.png" title="Entertainment"/>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #007AFF",  backgroundColor: "#007AFF"}} imageUrl="/images/scienceCategory.png" title="Science"/>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #68CC45",  backgroundColor: "#68CC45"}} imageUrl="/images/businessCategory.png" title="Business"/>
        <CategoryCard filters={filters} setFilters={setFilters} cardStyle={{border:"0.063rem solid #AC39FF",  backgroundColor: "#AC39FF"}} imageUrl="/images/techCategory.png" title="Technology"/>   
      </div>
  </>)
}

function CategoryCard({cardStyle, imageUrl, title, filters, setFilters}){
  function handleCategoryChange(){
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['category'] = title.toLowerCase()
    setFilters(newFilters)
  }

  return (<div className={styles.categoryCard} onClick={handleCategoryChange}>
    <div style={cardStyle} className={styles.categoryIcon} >
      <Image src={imageUrl} width={24} height={24} alt={title}/>
    </div>
    <h4 className={styles.categoryIconTitle}>{title}</h4>
  </div>)
}

function ReportersSection({filters, setFilters, reporters}){

  return (<>
  <h2 className={styles.categoriesTitle}>Top reporters in your country</h2>
      <hr className={styles.breakLine}/>
      <div>
        {reporters.map(r => <ReportCard filters={filters} setFilters={setFilters} key={r} cardStyle={{border:"0.063rem solid #007AFF", backgroundColor: "#007AFF"}} title={r}/>)}
      </div>
  </>)
}

function ReportCard({cardStyle, title, filters, setFilters}){
  function handleReporter(){
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['q'] = title
    setFilters(newFilters)
  }

  return (<div className={styles.categoryCard} onClick={handleReporter}>
    <div style={cardStyle} className={styles.categoryIconDiv}>
      <h3 className={styles.letterIcon}>{title.slice(0,1).toUpperCase()}</h3>
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
                  <Image src="/HCI_logo1.png" width={120} height={100} alt='News logo'/>
                </div>
                <div className={styles.currentDate}>{new Date(Date.now()).toDateString().slice(4,11)}</div>
              </div>
              <SearchBar filters={filters} setFilters={setFilters}/>
              <CountryPicker filters={filters} setFilters={setFilters} setReporters={setReporters} allReporters={allReporters}/>  
          </div>
          </div>
  );
}

function SearchBar({filters, setFilters}){
  const [query, setQuery] = useState(null)

  function handleNewQuery(event){
    setQuery(event.target.value)
  }

  function handleQuerySearched(){
    const newFilters = JSON.parse(JSON.stringify(filters))
    newFilters['q'] = query
    setFilters(newFilters)
  }

  return (
    <div className={styles.searchSection}>
      <div className={styles.search}>
         <input type="text" name="search" className={styles.round} placeholder='Search' onChange={handleNewQuery}/>
          <div className={styles.imgDiv}>
            <Image src="/images/searchIcon.png" width={24} height={24} alt='search icon'/>
          </div>
      </div>
      <div className={`${styles.imgDiv} ${styles.arrowIconBtn}`} onClick={handleQuerySearched}>
            <Image src="/images/searchArrowIcon.png" width={32} height={32} alt='search arrow icon'/>
          </div>
    </div>
  )
}

function CountryPicker({ filters, setFilters, setReporters, allReporters }){
  return (
    <div className={styles.country}>
    <div className={`${styles.imgDiv}`}>
      <Image src="/images/planet-earth.png" width={24} height={24} alt='planet icon'/>
    </div>
    <CountryDropDown filters={filters} setFilters={setFilters} setReporters={setReporters} allReporters={allReporters}/>
  </div>
  )
}

function CountryDropDown({ filters, setFilters, setReporters, allReporters }){
  const countriesNames = [{name:"Argentina", code:"ar"}, {name:"Australia", code:"au"}, {name:"Austria", code:"at"}, {name:"Belgium", code:"be"}, {name:"Brazil", code:"br"}, {name:"Bulgaria", code:"bg"}, {name:"Canada", code:"ca"}, {name:"China", code:"cn"}, {name:"Colombia", code:"co"},
{name:"Cuba", code:"cu"}, {name:"Czech Republic", code:"cz"}, {name:"Egypt", code:"eg"}, {name:"France", code:"fr"}, {name:"Germany", code:"de"}, {name:"Greece", code:"gr"}, {name:"Honk Kong", code:"hk"}, {name:"Hungary", code:"hu"}, {name:"India", code:"in"}, {name:"Indonesia", code:"id"}, {name:"Ireland", code:"ie"}, {name:"Israel", code:"il"}, {name:"Italy", code:"it"}, {name:"Japan", code:"jp"}, {name:"Latvia", code:"lv"}, {name:"Lithuania", code:"lt"},
{name:"Malaysia", code:"my"}, {name:"Mexico", code:"mx"}, {name:"Morocoo", code:"mk"}, {name:"Netherlands", code:"nl"}, {name:"New Zeland", code:"nz"}, {name:"Nigeria", code:"ng"},  {name:"Norway", code:"no"}, {name:"Philippines", code:"ph"}, {name:"Poland", code:"pl"}, {name:"Portugal", code:"pt"}, {name:"Romania", code:"ro"},
{name:"Russia", code:"ru"},{name:"Saudi Arabia", code:"sa"}, {name:"Serbia", code:"rs"}, {name:"Singapore", code:"sg"}, {name:"Slovakia", code:"sk"}, {name:"Slovenia", code:"si"}, {name:"South Africa", code:"za"}, {name:"South Korea", code:"kr"}, {name:"Sweden", code:"se"},
{name:"Switzerland", code:"sw"}, {name:"Taiwan", code:"tw"}, {name:"Thailand", code:"th"}, {name:"Turkey", code:"tr"}, {name:"UAE", code:"ae"}, {name:"Ukraine", code:"ua"}, {name:"UK", code:"gb"}, {name:"US", code:"us"}, {name:"Venuzuela", code:"Ve"}];

function handleChange(event){
  const newFilters = JSON.parse(JSON.stringify(filters))
  newFilters['country'] = event.target.value
  setFilters(newFilters)
  const filteredReporters = allReporters.filter(el => el['country'] == event.target.value).map(reporter => reporter['name']);
  setReporters(filteredReporters)
}

return (<select type="text" name="countries" className={styles.round} value={filters['country']} onChange={handleChange}>
  {countriesNames.map(c => <option key= {c['code']} value={c['code']}>{c['name']}</option>)}
</select>)
}


function MainArea({ filters }) {
  const [newsToShow, setNewsToShow] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollRef, scrollPercentage] = useScrollPercentage();
  const { topNews, isLoading, isError } = getTopNews(currentPage);

  // console.log(scrollPercentage);

  if (isLoading) return <Spinner />
  if (isError) return <Error />

  if (newsToShow === null) {
    setNewsToShow(topNews['articles']);
  }

  return (
    <>
      {newsToShow !== null &&
        <div className={styles.main_area_container}>
          <h2 className={styles.page_title}>Top Stories</h2>
          <div className={styles.story_grid}>
            {[newsToShow.shift()].map(bigStory => <BigStoryCard key={bigStory['title']} story={bigStory} />)}
            {newsToShow.map(regularStory => <RegularStoryCard key={regularStory['title']} story={regularStory} />)}
          </div>
        </div>
      }
    </>
  );
}

function getTopNews(page = 0, page_size = 20) {
  const { data, error, isLoading } = useSWR(`https://newsapi.org/v2/top-headlines?language=en&pageSize=${page_size}&page=${page}&apiKey=${newsApiKey}`, fetcher);

  return {
    topNews: data,
    isLoading,
    isError: error
  }
}

function RegularStoryCard({ story }) {
  return (
    <Link href={story['url']} style={{ textDecoration: 'none' }}>
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
  if (day != now.getDate()) {
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

function BigStoryCard({ story }) {
  return (
    <div className={styles.big_story + ' ' + styles.card}>
      <div className={styles.main_story_area}>
        <div className={styles.story_image}>
          <img src={story['urlToImage']} alt={story['title']} />
        </div>
        <div className={styles.story_content}>
          <div className={styles.story_source}>{story['source']['name'] || ''}</div>
          <div className={styles.story_title}>{story['title']}</div>
        </div>
      </div>
      <div className={styles.story_footer}>
        <p>{`${calculatePublishTime(story['publishedAt'])} • ${story['author'] || 'anonymous'}`}</p>
        <p className={styles.read_article_btn}>{'➤'}</p>
      </div>

    </div>
  );
}
