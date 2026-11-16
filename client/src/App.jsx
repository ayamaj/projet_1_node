import { useTheme } from './context/ThemeContext';

import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import NotificationToast from './components/NotificationToast';

export default function App() {

  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>

      <Navbar />

      <main className="container">

        <h1>Bienvenue chez TechStore</h1>

        <div className="content-grid">

          <section>
            <h2>Catalogue des produits</h2>
            <ProductList />
          </section>

          <section>
            <Cart />
          </section>

        </div>

      </main>

      <NotificationToast />

    </div>
  );
}