import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  visible: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {

    showToast: (state, action) => {
      state.message = action.payload;
      state.visible = true;
    },

    hideToast: (state) => {
      state.visible = false;
      state.message = '';
    }

  }
});

export const {
  showToast,
  hideToast
} = uiSlice.actions;

export default uiSlice.reducer;