import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReferralState {
  referralCode: string;
}

const initialState: ReferralState = {
  referralCode: '',
};

const referralLinkSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setReferralCode: (state, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
    },
    clearReferralCode: (state) => {
      state.referralCode = '';
    },
  },
});

export const { setReferralCode, clearReferralCode } = referralLinkSlice.actions;
export default referralLinkSlice.reducer;
