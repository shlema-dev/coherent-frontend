import React from 'react';

interface StaticTitleProps {
  title: string;
}

const StaticTitle: React.FC<StaticTitleProps> = ({ title }) => {
  return <div className='flex justify-start align-start mb-10'>
    <h1 className='font-bold text-4xl'>{title}</h1>
  </div>
};

export default StaticTitle;
