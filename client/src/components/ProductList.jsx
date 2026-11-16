
// import { useDispatch, useSelector } from 'react-redux';

// import { addItem } from '../redux/cartSlice';

// const PRODUCTS = [

//   {
//     id: 1,
//     name: 'Ecran UltraWide 4K 34"',
//     price: 850,
//     category: 'Affichage',
//     icon: '[ Ecran ]',
//     stock: 3
//   },

//   {
//     id: 2,
//     name: 'Clavier Mecanique RGB',
//     price: 180,
//     category: 'Peripherique',
//     icon: '[ Clavier ]',
//     stock: 3
//   },

//   {
//     id: 3,
//     name: 'Souris Sans Fil Ergonomique',
//     price: 95,
//     category: 'Accessoire',
//     icon: '[ Souris ]',
//     stock: 3
//   },

//   {
//     id: 4,
//     name: 'Casque Haute Fidelite ANC',
//     price: 320,
//     category: 'Audio',
//     icon: '[ Audio ]',
//     stock: 3
//   }

// ];

// export default function ProductList() {

//   const dispatch = useDispatch();

//   const cartItems = useSelector(
//     (state) => state.cart.items
//   );

//   return (
//     <div className="product-section">

//       <div className="section-title-box">

//         <h3>Catalogue Produits</h3>

//         <p className="subtitle-hint">
//           Chaque clic declenche une action via dispatch(addItem(p)).
//         </p>

//       </div>

//       <div className="product-grid">

//         {PRODUCTS.map((product) => {

//           const existing = cartItems.find(
//             (item) => item.id === product.id
//           );

//           const quantity = existing ? existing.quantity : 0;

//           const outOfStock = quantity >= product.stock;

//           return (
//             <div key={product.id} className="product-card">

//               <div className="card-top">

//                 <span className="product-icon">
//                   {product.icon}
//                 </span>

//                 <span className="product-category">
//                   {product.category}
//                 </span>

//               </div>

//               <h4 className="product-title">
//                 {product.name}
//               </h4>

//               <div className="product-stock">
//                 Stock disponible : {product.stock - quantity}
//               </div>

//               <div className="card-bottom">

//                 <span className="product-price">
//                   {product.price} DT
//                 </span>

//                 <button
//                   className="btn btn-add"
//                   disabled={outOfStock}
//                   onClick={() => dispatch(addItem(product))}
//                 >
//                   {outOfStock ? 'Rupture de Stock' : '+ Ajouter'}
//                 </button>

//               </div>

//             </div>
//           );
//         })}

//       </div>

//     </div>
//   );
// }


import { useDispatch } from 'react-redux';

import { addItem } from '../redux/cartSlice';
import { showToast } from '../redux/uiSlice';

const PRODUCTS = [
  {
    id: 1,
    name: 'Ecran UltraWide 4K 34"',
    price: 850,
    category: 'Affichage'
  },
  {
    id: 2,
    name: 'Clavier Mecanique RGB',
    price: 180,
    category: 'Peripherique'
  },
  {
    id: 3,
    name: 'Souris Sans Fil Ergonomique',
    price: 95,
    category: 'Accessoire'
  },
  {
    id: 4,
    name: 'Casque Haute Fidelite ANC',
    price: 320,
    category: 'Audio'
  }
];

export default function ProductList() {

  const dispatch = useDispatch();

  const handleAdd = (product) => {
    dispatch(addItem(product));

    // Défi 3 : notification après chaque ajout
    dispatch(
      showToast(`${product.name} ajoute au panier`)
    );
  };

  return (
    <div className="product-grid">

      {PRODUCTS.map((product) => (

        <div key={product.id} className="product-card">

          <h4>{product.name}</h4>

          <p>{product.category}</p>

          <span>{product.price} DT</span>

          <button onClick={() => handleAdd(product)}>
            + Ajouter
          </button>

        </div>

      ))}

    </div>
  );
}