import React from 'react';
import { MultiSelect } from "react-multi-select-component";


function SelectMulti({ apps, selected, setSelected }) {

  /************************************************************* 
   * Function to add keys required by MultiSelect
   * label and value keys are required
   ************************************************************/
  function addKeys() {
    apps = apps.map(function(obj) {
        obj.label = obj.title;
        obj.value = obj.title;
        return obj;
    })
  };
  addKeys();


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
    <MultiSelect
      options={apps}
      value={selected}
      onChange={setSelected}
      filterOptions={filterOptions}
      />
  )
};

export default SelectMulti;