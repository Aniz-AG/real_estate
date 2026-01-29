import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import propertyReducer from './slices/propertySlice';
import adminUserReducer from './slices/admin/adminUserSlice';
import adminPropertyReducer from './slices/admin/adminPropertySlice';
import adminContactReducer from './slices/admin/adminContactSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        property: propertyReducer,
        adminUser: adminUserReducer,
        adminProperty: adminPropertyReducer,
        adminContact: adminContactReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
