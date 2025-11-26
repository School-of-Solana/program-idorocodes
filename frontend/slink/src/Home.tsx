
import NavBar from './homeComponets/NavBar'
import Hero from './homeComponets/Hero'
import Features from './homeComponets/Features'
import FAQ from './homeComponets/Faq'
import Footer from './homeComponets/Footer'
import './index.css'

const Home = () =>  {


  return (
    <div className='bg-green-50'>
   
      <NavBar/>
      <Hero/>
      <Features/>
      <FAQ/>
      <Footer/>
        
         
    </div>
  )
}

export default Home
