import React, { useState} from 'react';

function getLastItem(data) {
  return data.length ? data[data.length - 1][Object.keys(data[0])[0]] : 0;
}

function Popup({ value, onNewData }) {
  const columns = Object.keys(value[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState({ [columns[0]]: getLastItem(value) + 1 });


  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onNewData(newItem);
    setNewItem({ [columns[0]]: getLastItem(value) + 2 });
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={togglePopup}>Create new</button>
      {isOpen && (
        <div>
          <h2>New Item</h2>
          <form onSubmit={handleSubmit}>
            {columns.map((col) => (
              <label key={col}>
                {col}
                {col === columns[0] ? (
                  <input
                    type="text"
                    name={col}
                    value={newItem[col] || ''}
                    onChange={(event) =>
                      setNewItem({ ...newItem, [col]: event.target.value })
                    }
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    name={col}
                    value={newItem[col] || ''}
                    onChange={(event) =>
                      setNewItem({ ...newItem, [col]: event.target.value })
                    }
                  />
                )}
              </label>
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

export default Popup;
