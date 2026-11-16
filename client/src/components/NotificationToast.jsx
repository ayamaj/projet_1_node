import { useEffect } from 'react';

import {
  useSelector,
  useDispatch
} from 'react-redux';

import { hideToast } from '../redux/uiSlice';

export default function NotificationToast() {

  const { message, visible } = useSelector(
    (state) => state.ui
  );

  const dispatch = useDispatch();

  useEffect(() => {

    if (visible) {

      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [visible, message, dispatch]);

  if (!visible) {
    return null;
  }

  return (
    <div className="toast">
      <span>✓</span>
      {message}

      <button onClick={() => dispatch(hideToast())}>
        ×
      </button>
    </div>
  );
}