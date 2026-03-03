import Hero from '../components/Hero/Hero';
import FindYourTeam from '../components/FindYourTeam/FindYourTeam';
import JerseyGrid from '../components/JerseyGrid/JerseyGrid';
import { useJerseysList } from '../hooks/useJerseysList';
import { useState } from 'react';
import classes from './Home.module.scss';

const Home = () => {
  const [league, setLeague] = useState('all');
  const params = league === 'all' ? {} : { league };
  const { jerseys, loading, error } = useJerseysList(params);

  return (
    <main>
      <Hero />
      <FindYourTeam onSelect={setLeague} />
      <section id="jersey-grid" className={classes.section}>
        <div className={classes.container}>
          <JerseyGrid jerseys={jerseys} loading={loading} error={error} />
        </div>
      </section>
    </main>
  );
};

export default Home;
