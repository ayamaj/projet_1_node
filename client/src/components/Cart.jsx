import { useState } from 'react';

import {
  useSelector,
  useDispatch
} from 'react-redux';

import {
  addItem,
  removeItem,
  clearCart,
  applyPromoCode
} from '../redux/cartSlice';

export default function Cart() {

  const {
    items,
    totalCount,
    totalPrice,
    discountPercent
  } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const [promoCode, setPromoCode] = useState('');

  const discountedPrice =
    totalPrice * (1 - discountPercent / 100);

  const handlePromo = () => {
    dispatch(
      applyPromoCode(promoCode.toUpperCase())
    );

    setPromoCode('');
  };

  return (
    <div className="cart-card">

      <div className="cart-header">

        <h3>Mon Panier Redux</h3>

        {items.length > 0 && (
          <button onClick={() => dispatch(clearCart())}>
            Vider
          </button>
        )}

      </div>

      {items.length === 0 ? (

        <p>Le panier est actuellement vide.</p>

      ) : (

        <>

          {items.map((item) => (

            <div key={item.id} className="cart-row">

              <span>
                {item.name}
                ({item.price} DT x {item.quantity})
              </span>

              <div>

                <button
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  -
                </button>

                <span> {item.quantity} </span>

                <button
                  onClick={() => dispatch(addItem(item))}
                >
                  +
                </button>

              </div>

            </div>

          ))}

          <hr />

          {/* Défi 2 : Code Promo */}

          <div className="promo-box">

            <h4>Code Promo</h4>

            <input
              type="text"
              placeholder="POLY2027"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />

            <button onClick={handlePromo}>
              Appliquer
            </button>

          </div>

          {discountPercent > 0 && (
            <p className="discount">
              Remise : {discountPercent} %
            </p>
          )}

          <p>
            Nombre total d'articles :
            <strong> {totalCount}</strong>
          </p>

          <p>
            Sous-total :
            <strong> {totalPrice} DT</strong>
          </p>

          <h3 className="total">
            Montant Total : {discountedPrice.toFixed(2)} DT
          </h3>

        </>

      )}

    </div>
  );
}