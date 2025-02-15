import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import basicReducer from './features/basicInfoSlice';
import educationReducer from './features/educationSlice';
import careerReducer from './features/careerSlice';
import skillReducer from './features/skillsSlice';
import resumeReducer from './features/resumeSlice';
import protfolioReducer from './features/protfolioSlice';



const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  basicInfo: basicReducer,
  education: educationReducer,
  career: careerReducer,
  skills: skillReducer,
  resume: resumeReducer,
  portfolio: protfolioReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
