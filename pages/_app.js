import '../styles/globals.css'
import Layout from '../components/Layout'
import Menu from '../components/Menu'
import MyModal from '../components/Modal'
import { createContext , useState } from 'react'

export const modalToogle = createContext();

function MyApp({ Component, pageProps}) {
  const [toggle,changetoggle] = useState(true)
  return (
    <Layout >
      <modalToogle.Provider value={{toggle,changetoggle}}>
        <MyModal>
          <Component {...pageProps}/>
        </MyModal>
        <Menu list={pageProps.list} base={pageProps.base}/> 
      </modalToogle.Provider>
    </Layout>
    )
}

export default MyApp
