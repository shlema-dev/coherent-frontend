import React from 'react';

interface StaticDescriptionProps {
  description: string;
}

const StaticDescription: React.FC<StaticDescriptionProps> = ({ description }) => {
  return <div className='flex justify-start align-start mt-10'>
    <p className='font-semiBold text-2xl text-gray-600'>{description}</p>
  </div>
};

export default StaticDescription;
