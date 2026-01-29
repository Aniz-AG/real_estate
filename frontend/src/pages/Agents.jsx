import React, { useEffect } from 'react';
import AgentCard from '../components/AgentCard.jsx';


import { useSelector, useDispatch } from 'react-redux'
import { getAgents } from '../redux/slices/propertySlice.js'
import toast from 'react-hot-toast';



function Agents() {
  

  const { agents } = useSelector((state)=>state.property);
  const dispatch = useDispatch();


  const setAgents = ()=>{
      dispatch(getAgents())
      .then(data =>{
          if(data.payload?.success){
              toast.success("Agent fetched successfully")

          }
          else{
               toast.error("somethign went wrong...")
          }
      })
  }

  useEffect(()=>{
      setAgents();
  },[dispatch])


  return (
    <section className="py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Our Top Agents
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Meet our experienced and professional real estate agents who are ready
          to help you find your dream home.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {agents.map(({_id, username, photo}) => (
            <div
              key={_id}
              className="w-full sm:w-[48%] md:w-[30%] lg:w-[22%]"
            >
              <AgentCard _id={_id} name={username} imgUrl={photo.url} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Agents;
