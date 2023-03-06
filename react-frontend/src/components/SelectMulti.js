import React from 'react';
import { MultiSelect } from "react-multi-select-component";


// IMPORTANT:  MultiSelect requires objects to have properties: label and value
function SelectMulti({ items, selected, setSelected }) {

  /************************************************************* 
   * Search option for MultiSelect 
   * Source: https://www.npmjs.com/package/react-multi-select-component
   ************************************************************/
  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(({ label }) => label && label.match(re));
  };

  return (
    <div className='select'>
      <MultiSelect
        options={items}
        value={selected}
        onChange={setSelected}
        filterOptions={filterOptions}
        />
    </div>
  )
};

export default SelectMulti;