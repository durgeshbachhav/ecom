import Header from "../header/Header.jsx";
import Footer from "../footer/Footer.jsx";

const Layout = ({ children }) => {
     return (
          <div>
               <Header />
               <div className="container mx-auto">
                    {
                         children
                    }
               </div>
               <Footer />
          </div>
     )
};

export default Layout;
