import React from 'react';

function appsNamesLinks({ application }) {
  let row;
  
  if (application.link !== '') {
    row = <a href={application.link}>{application.title}<br /></a>
  } else {
    row = <>{application.title}<br /></>
  };

  return (
    row
  )
};

export default appsNamesLinks;