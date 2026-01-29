import React from 'react';
import { Link } from 'react-router-dom';

const AgentCard = ({ _id, name, imgUrl = "/images/default-agent.jpg" }) => {
  return (
    <Link
      to={`/agent/${_id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 p-6 text-center"
    >
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-sm group-hover:shadow-md bg-gray-100">
        <img
          src={imgUrl}
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <span className="mt-4 block text-gray-800 text-lg font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        {name}
      </span>
    </Link>
  );
};

export default AgentCard;
