import React from 'react';

const SearchForm = ({value,onChange}) => {
    return (
        <input 
            type="text"
            name="query"
            className="form-control my-3"
            placeholder="search..."
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
        />
      );
}
 
export default SearchForm;