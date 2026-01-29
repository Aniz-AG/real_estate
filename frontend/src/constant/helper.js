import { getMyProfile, userExist, userNotExist } from '../redux/slices/userSlice.js'
import { useDispatch } from 'react-redux'

export const setProfile = ()=>{
    const dispatch = useDispatch();
    dispatch(getMyProfile())
    .then(data=>{
         if(data.payload?.success){
             console.log("set when the login...")
             userExist(data.payload.user)
         }else{
             userNotExist();
         }
    })
}