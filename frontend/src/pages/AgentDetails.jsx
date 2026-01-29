import React, { useEffect, useState } from 'react';
import AgentDetailedCard from '../components/AgentDeatiledCard.jsx';
import PropertyCard from '../components/PropertyCard.jsx';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getSingleAgent, getAgentProperty } from '../redux/slices/propertySlice.js';

function AgentDetails() {
  const [agent, setAgent] = useState({
    name: '',
    email: '',
    phone: '',
    imgUrl: '',
  });

  const [agentProperties, setAgentProperties] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();

  const setSingleAgent = (id) => {
    dispatch(getSingleAgent(id)).then((data) => {
      if (data.payload?.success) {
        const { username, phone, email, photo } = data.payload.agent;
        setAgent({
          name: username,
          imgUrl: photo.url,
          phone,
          email,
        });
        toast.success("agent fetched succesfully..")
      } else {
         toast.error("somthing went worng. while fetching agent...")
      }
    });
  };

  const setAgentProperty = (id) => {
    dispatch(getAgentProperty(id)).then((data) => {
      if (data.payload?.success) {
        const properties = data.payload.properties;
        setAgentProperties(properties);
      } else {
        toast.error("some error while fetching agent properties");
      }
    });
  };

  useEffect(() => {
    setSingleAgent(id);
    setAgentProperty(id);
  }, [id]);

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto space-y-10">
      {/* Agent Info */}
      <AgentDetailedCard
        name={agent.name}
        email={agent.email}
        phone={agent.phone}
        imgUrl={agent.imgUrl}
        propertyCount={agentProperties.length}
      />

      {/* Agent Properties Heading */}
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {agent.name}&apos;s Properties
        </h2>

        {/* Show message if no properties */}
        {agentProperties.length === 0 ? (
          <div className="text-center text-gray-500">No properties posted by this agent.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {agentProperties.map(
              ({
                address,
                _id,
                property_type,
                price,
                photos,
                nums_bedrooms,
                nums_bathrooms,
                square_feet,
                status,
                usage_type,
                description,
              }) => {
                const { property_address, city, state, pincode } = address;
                const photoUrl = photos?.[0]?.url || "https://via.placeholder.com/300";

                return (
                  <PropertyCard
                    key={_id}
                    _id={_id}
                    property_address={property_address}
                    city={city}
                    state={state}
                    pincode={pincode}
                    property_type={property_type}
                    usage_type={usage_type}
                    nums_bedrooms={nums_bedrooms}
                    nums_bathrooms={nums_bathrooms}
                    square_feet={square_feet}
                    status={status}
                    description={description}
                    price={price}
                    photoUrl={photoUrl}
                  />
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentDetails;
