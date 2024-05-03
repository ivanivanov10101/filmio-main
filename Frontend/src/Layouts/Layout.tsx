import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import FooterCom from '../components/Footer/Footer';
import TopScroll from '../components/TopScroll.tsx';

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen text-gray-800 bg-white dark:text-neutral-50 dark:bg-[#192023]'>
            <TopScroll />
            <Header />
            <div className='flex-1'>
                <Outlet />
            </div>
            <FooterCom />
        </div>
    );
};

export default Layout;
