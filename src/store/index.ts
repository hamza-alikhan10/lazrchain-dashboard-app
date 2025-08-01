import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//Slices
import layoutReducer from '@/features/layout/layoutSlice';
import authReducer from '@/features/authUser/authSlice'
import referralLink from '@/features/wallet/refferalLinkSlice'

//RTK query api's
import { walletAddressApi } from '@/features/wallet/walletAddressApi';
import { authApi } from '@/features/authUser/authApi';
import { tiersApi } from '@/features/Ref_Rew_Tiers/tiers';
import { yieldAndDepositApi } from '@/features/wallet/deposit&withdrawalApi';
import { dailyEarnings } from '@/features/wallet/dailyEarningsApi';
import { referralEarningsApi } from '@/features/referral/referralApi';


/* ----------  Per‑slice persistence configs  ---------- */
const persistConfigLayout = {
  key: 'layout',
  storage,
};

const persistConfigUserSignupData = {
  key: 'auth',
  storage,
};

const persistConfigReferralLink = {
  key: 'referral',
  storage,
};



/* ----------  Wrap the reducers  ---------- */
const persistedLayout   = persistReducer(persistConfigLayout, layoutReducer);
const persistedUserSignupData   = persistReducer(persistConfigUserSignupData, authReducer);
const persistedUserReferralLink   = persistReducer(persistConfigReferralLink, referralLink);


/* ----------  Store  ---------- */
export const store = configureStore({
  reducer: {
    layout:    persistedLayout,
    auth:      persistedUserSignupData,
    referral:  persistedUserReferralLink,

    // [locationApi.reducerPath]: locationApi.reducer,
    [walletAddressApi.reducerPath]: walletAddressApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [tiersApi.reducerPath]: tiersApi.reducer,
    [yieldAndDepositApi.reducerPath]: yieldAndDepositApi.reducer,
    [dailyEarnings.reducerPath]: dailyEarnings.reducer,
    [referralEarningsApi.reducerPath]: referralEarningsApi.reducer,

    },

    /* RTK‑Query reducers (non‑persistent) */
    // [authUserApi.reducerPath]:  authUserApi.reducer,
 middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(
      walletAddressApi.middleware,
      authApi.middleware,
      tiersApi.middleware,
      yieldAndDepositApi.middleware,
      dailyEarnings.middleware,
      referralEarningsApi.middleware,

    ),
});

/* ----------  Persistor  ---------- */
export const persistor = persistStore(store);


/* ----------  Types  ---------- */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
