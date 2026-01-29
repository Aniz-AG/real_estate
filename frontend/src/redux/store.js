import { configureStore } from '@reduxjs/toolkit'

import  userSlice  from './slices/userSlice.js'
import  propertySlice  from './slices/propertySlice.js'


// admin slice make more authicated...
import  adminPropertySlice  from './slices/admin/adminPropertySlice.js'
import adminUserSlice from './slices/admin/adminUserSlice.js'
import adminContactSlice from './slices/admin/adminContactSlice.js'

export const store = configureStore({ 
    
    reducer:{
       [userSlice.name]:userSlice.reducer,
       [propertySlice.name]:propertySlice.reducer,
       [adminPropertySlice.name]:adminPropertySlice.reducer,
       [adminUserSlice.name]:adminUserSlice.reducer,
       [adminContactSlice.name]:adminContactSlice.reducer,
    }

})

