import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { Player } from '../components/Player';
import { Header } from '../components/Header';
import PlayerContextProvider from '../contents/player/contextProvider';


function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
