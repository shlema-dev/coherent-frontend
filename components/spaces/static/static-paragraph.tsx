import React from 'react';

interface StaticParagraphProps {
  paragraph: string;
}

const StaticParagraph: React.FC<StaticParagraphProps> = ({ paragraph }) => {
  return <div className='flex justify-start align-start mt-10'>
    <p className='text-lg text-gray-600'>{paragraph}</p>
  </div>
};

export default StaticParagraph;
