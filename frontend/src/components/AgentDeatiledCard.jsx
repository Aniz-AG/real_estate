import React from 'react';
import {
  FaEnvelope,
} from "react-icons/fa";

const AgentDetailedCard = ({
  name,
  email,
  phone,
  imgUrl = '/images/default-agent.jpg',
  propertyCount = 0,
}) => {
  return (
    <div className="bg-white  p-6 flex flex-col  md:flex-row items-center gap-10 max-w-3xl mx-auto">
      {/* Agent Image */}
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-md">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Agent Info */}
      <div className="flex-1  cursor-pointer  text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="flex items-center gap-2 text-gray-700 hover:underline">
          <FaEnvelope className="text-indigo-500" />
          <a
            href={`mailto:${email}`}
            className="hover:text-indigo-600"
          >
            {email || "N/A"}
          </a>
        </p>

        <p className="text-gray-600 mt-1">📞 +91 {phone}</p>
        <p className="text-gray-700 mt-2 font-medium">
          🏠 Properties Listed: <span className="font-semibold text-blue-600">{propertyCount}</span>
        </p>
      </div>
    </div>
  );
};

export default AgentDetailedCard;
