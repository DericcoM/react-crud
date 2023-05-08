import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/App.css";
import Table from "./Table";

function TableButtons() {
  const [tableNames, setTableNames] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/tables")
      .then((response) => {
        setTableNames(response.data);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (selectedTable !== "") {
      axios
        .get(`http://localhost:3001/tables/${selectedTable}`)
        .then((response) => {
          setTableData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedTable]);

  function selectTable(tableName) {
    setSelectedTable(tableName);
    setTableData([]);
    axios
      .get(`http://localhost:3001/tables/${tableName}`)
      .then((response) => {
        setTableData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  

  function handleNewData(newData) {
    setTableData([...tableData, newData]);
    axios
      .post(`http://localhost:3001/insert/${selectedTable}`, newData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function deleteDataByValue(tableName, columnName, columnValue, callback) {
    axios
      .delete(`http://localhost:3001/delete/${tableName}/${columnName}/${columnValue}`)
      .then((response) => {
        console.log(response);
        callback(null, response);
      })
      .catch((error) => {
        console.error(error);
        callback(error);
      });
  }

  function handleDeleteData(row) {
    const index = tableData.indexOf(row);
    if (index > -1) {
      const columnName = Object.keys(row)[0];
      const columnValue = row[columnName];
      deleteDataByValue(selectedTable, columnName, columnValue, (err, res) => {
        if (!err) {
          setTableData(tableData.filter((_, i) => i !== index));
        }
      });
    }
  }

  function updateDataById(columnName, tableName, dataId, newData, callback) {
    
    axios
      .put(`http://localhost:3001/update/${tableName}/${columnName}/${dataId}`, newData)
      .then((response) => {
        console.log(response);
        callback(null, response);
      })
      .catch((error) => {
        console.error(error);
        callback(error);
      });
  }
  
  function handleUpdateData(dataId, newData, columnName) {
    const index = tableData.findIndex((row) => row[columnName] === dataId);
    if (index > -1) {
      const oldData = tableData[index];
      const updatedData = { ...oldData, ...newData };
      updateDataById(columnName, selectedTable, dataId, updatedData, (err, res) => {
        if (!err) {
          setTableData([
            ...tableData.slice(0, index),
            updatedData,
            ...tableData.slice(index + 1),
          ]);
        }
      });
    }
  }
  
  
  return (
    <div>
      {error ? (
        <p>No database connection</p>
      ) : (
        <>
          <p className="table_pick-title">Choose table</p>
          <div className="table_pick">
            {tableNames.map((row) => (
              <button
                className="table__button"
                key={row.table_name}
                onClick={() => selectTable(row.table_name)}
              >
                <span>{row.table_name}</span>
              </button>
            ))}
          </div>
          {selectedTable && (
            <Table
              key={selectedTable}
              data={tableData}
              onNewData={handleNewData}
              onDeleteData={handleDeleteData}
              tableName={selectedTable}
              onUpdateData={handleUpdateData}
            />
          )}
        </>
      )}
    </div>
  );
}

export default TableButtons;
