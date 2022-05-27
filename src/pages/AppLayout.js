import Header from '../components/header';
import Footer from '../components/footer';

const AppLayout = (props) => {
  return (
    <div className='app-layout font-sans bg-backImg  w-full h-full block bg-no-repeat bg-cover bg-fixed'>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export default AppLayout;
