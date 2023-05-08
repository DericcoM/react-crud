import React, { useState} from 'react';

function PopupEdit({ value, onUpdateData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({});

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsOpen(false);
    onUpdateData(Object.values(value)[0], newItem, Object.keys(value)[0]);
    // console.log(Object.values(value)[0], newItem, Object.keys(value)[0])
  };
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  return (
    <div>
      <button onClick={togglePopup}>Edit</button>
      {isOpen && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            {Object.keys(value).map((key) => (
              <div key={key}>
                <label htmlFor={key}>{key}</label>
                {key === Object.keys(value)[0] ? (
                    <input
                        type="text"
                        name={key}
                        value={newItem[key] || value[key]}
                        onChange={handleInputChange}
                        readOnly
                    />
                ) : (
                    <input
                        type="text"
                        name={key}
                        value={newItem[key] || value[key]}
                        onChange={handleInputChange}
                    />
                )}
              </div>
            ))}
            <button type="submit">Save</button>
          </form>
          <button className="close" onClick={togglePopup}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default PopupEdit;
