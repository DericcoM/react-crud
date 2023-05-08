import React, { useState, useEffect } from "react";
import Popup from "./PopupCreate";
import PopupEdit from "./PopupEdit";


function Table({ data, onNewData, onDeleteData, onUpdateData }) {
  const [newDelete, setNewDelete] = useState(null);
  const [sortedData, setSortedData] = useState([]);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(true);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => a[Object.keys(a)[0]] - b[Object.keys(b)[0]]);
    setSortedData(sorted);
  }, [data]);

  if (!sortedData || !sortedData.length) {
    return null;
  }

  const columns = Object.keys(sortedData[0]).concat("administrate");

  const handleDelete = (event, index) => {
    event.preventDefault();
    setIsDeleteConfirmed(false);
    setNewDelete(index);
  };

  const handleDeleteConfirmed = () => {
    const index = newDelete;
    const row = sortedData[index];
    setIsDeleteConfirmed(true);
    onDeleteData(row, (err, res) => {
      if (!err) {
        setNewDelete(null);
        setIsDeleteConfirmed(true);
      }
    });
  };

  return (
    <div>
      <Popup value={sortedData} onNewData={onNewData} length={sortedData.length} />
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {columns.map((col, colIndex) => (
                <React.Fragment key={`cell-${rowIndex}-${colIndex}`}>
                  {col === "administrate" ? (
                    <td>
                      <PopupEdit rowIndex={rowIndex + 1} value={row} onUpdateData={onUpdateData}/>
                      <button>Detail</button>
                      <button onClick={(event) => handleDelete(event, rowIndex)}>
                        Delete
                      </button>
                    </td>
                  ) : (
                    <td>{row[col]}</td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {newDelete !== null && !isDeleteConfirmed && sortedData.length > 0 && (
        <div>
          <p>Are you sure you want to delete this row?</p>
          <button onClick={() => handleDeleteConfirmed()}>Yes</button>
          <button onClick={() => setNewDelete(null)}>No</button>
        </div>
      )}
    </div>
  );
}

export default Table;
