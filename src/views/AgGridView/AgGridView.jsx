import React, { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { csv } from "csvtojson";
import { useNavigate  } from 'react-router-dom'

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

const AgGridView = () => {

  const navigate = useNavigate()

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [filterOptions, setFilterOptions] = useState(['mega'])
  const [originalData, setOriginalData] = useState(null)

  const onGridReady = async (params) => {
    console.log(params)
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {     
      // params.api.setRowData(data);
      params.api.setRowData(data.filter(item => parseFloat(item['Market Cap']) > 200000000000))
      setOriginalData(data)
    };

    const url = "./nasdaq.csv";
    const res = await fetch(url);
    const text = await res.text();
    const jsonArray = await csv().fromString(text);
    await updateData(jsonArray);
  };

  const onFilterOpened = (e) => {
    console.log('onFilterOpened', e);
  };

  const onFilterChanged = (e) => {
    console.log('onFilterChanged', e);
    console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
  };

  const onFilterModified = (e) => {
    console.log('onFilterModified', e);
    console.log('filterInstance.getModel() =>', e.filterInstance.getModel());
    console.log(
      'filterInstance.getModelFromUi() =>',
      e.filterInstance.getModelFromUi()
    );
  };

  var marketCapParams = {
    allowedCharPattern: '\\d\\-\\,', // note: ensure you escape as if you were creating a RegExp from a string
    numberParser: text => {
      return text == null ? null : parseFloat(text.replace(',', '.'));
    }
  };

  var marketCapFormatter = function (params) {
    //console.log(parseFloat(params.value)).toFixed(3)
    var formatted = parseFloat(params.value).toFixed(0).replace('.', ',');

    if (formatted.indexOf('-') === 0) {
      return formatted.slice(1);
    }

    return formatted;
  };

  // const symbolFilter = async (mysymbol) => {
  //   console.log(gridApi)
  //   setTimeout(() => {
  //     const column = {
  //       symbol: {
  //           filterType: 'text',
  //           type: 'equals',
  //           filter: mysymbol
  //       }
  //   }

  //   gridApi.setFilterModel(column);
  //   }, 3000)

  // if(symbol == 'A')
  // countryFilterComponent.setModel({
  //   values: ['A'],
  // });
  // if(symbol == 'AA')
  // countryFilterComponent.setModel({
  //   values: ['AA'],
  // });

  // if(symbol == 'AAC')
  // countryFilterComponent.setModel({
  //   values: ['AAC'],
  // });

  //};
  // useEffect(() => {
  //   async function fetchMyAPI() {
  //     const url ="./nasdaq.csv";
  //     const res = await fetch(url);
  //     const text = await res.text();
  //     const jsonArray = await csv().fromString(text);
  //     await setRowData(jsonArray);
  //     console.log(jsonArray)
  //   }
  //   fetchMyAPI()
  //     // fetch('https://www.ag-grid.com/example-assets/row-data.json')
  //     //     .then(result => result.json())
  //     //     .then(rowData => setRowData(rowData))
  // }, []);

  const handleMarketFilter = (options) => {    
    let filteredData = [] 
    if (options.length === 0) {     
      filteredData = originalData
    } else {
      options.forEach(option => {  
        if (option === 'mega') {
          filteredData = [...filteredData, ...originalData.filter(item => parseFloat(item['Market Cap']) > 200000000000)];
        } else if (option === 'large') {
          filteredData = [...filteredData, ...originalData.filter(item => parseFloat(item['Market Cap']) <= 200000000000 && parseFloat(item['Market Cap']) >= 10000000000)];
        } else if (option === 'medium') {
          filteredData = [...filteredData, ...originalData.filter(item => parseFloat(item['Market Cap']) <= 10000000000 && parseFloat(item['Market Cap']) >= 2000000000)];
        } else if (option === 'small') {
          filteredData = [...filteredData, ...originalData.filter(item => parseFloat(item['Market Cap']) <= 2000000000 && parseFloat(item['Market Cap']) >= 300000000)];
        } else if (option === 'micro') {
          filteredData = [...filteredData, ...originalData.filter(item => parseFloat(item['Market Cap']) <= 300000000 && parseFloat(item['Market Cap']) >= 50000000)];
        } else if (option === 'nano') {
          filteredData = [...filteredData, ...originalData.filter(item => parseFloat(item['Market Cap']) < 50000000 || item['Market Cap'] === '')];
        } else {
          filteredData = originalData
        }
      });
    }        
    gridApi.setRowData(filteredData)
  }

  const externalFilterChanged = (e) => {   
    // console.log(originalData)
    // filterOption=e.target.name     
    if (e.target.checked) {      
      handleMarketFilter([...filterOptions, e.target.name])
      setFilterOptions([...filterOptions, e.target.name])
    } else {
      handleMarketFilter(filterOptions.filter(option => option !== e.target.name))
      setFilterOptions(filterOptions.filter(option => option !== e.target.name))
    }
    
    // gridApi.onFilterChanged();
  }

  const onSelectionChanged = () => {
    navigate('/chart')
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="example-wrapper d-flex">       
        <div className="chechbox-list">
          <h3>Market Cap</h3>
          <div>
            <input type="checkbox" id="mega" name="mega" value="mega" onChange={externalFilterChanged} defaultChecked />
            <label for="mega">{ 'Mega (>$200B)' }</label>
          </div>
          <div>
            <input type="checkbox" id="large" name="large" value="large" onChange={externalFilterChanged} />
            <label for="large">{ 'Large ($10B-$200B)' }</label>
          </div>
          <div>
            <input type="checkbox" id="medium" name="medium" value="medium" onChange={externalFilterChanged} />
            <label for="medium">{ 'Medium ($2B-$10B)' }</label>
          </div>
          <div>
            <input type="checkbox" id="small" name="small" value="small" onChange={externalFilterChanged} />
            <label for="small">{ 'Small ($300M-$2B)' }</label>
          </div>
          <div>
            <input type="checkbox" id="micro" name="micro" value="micro" onChange={externalFilterChanged} />
            <label for="micro">{ 'Micro ($50M-$300M)' }</label>
          </div>
          <div>
            <input type="checkbox" id="nano" name="nano" value="nano" onChange={externalFilterChanged} />
            <label for="nano">{ 'Nano (<$50M)' }</label>
          </div>
        </div>
        <div className="ag-theme-alpine-dark" style={{ height: '100vh', width: '100%' }}>
          <AgGridReact
            suppressDragLeaveHidesColumns={true}
            defaultColDef={{
              flex: 1,
              minWidth: 150,
              filter: true,
              floatingFilter: true,
              sortable: true
            }}
            rowSelection={'single'}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            // onFilterOpened={onFilterOpened}
            // onFilterChanged={onFilterChanged}
            // onFilterModified={onFilterModified}
            rowData={rowData}           
            isExternalFilterPresent={true}
          >
            <AgGridColumn
              id="symbol"
              filter="agTextColumnFilter"
              field="Symbol"
            ></AgGridColumn>
            <AgGridColumn
              field="Name"
              filter="agTextColumnFilter"
              filterParams={{ buttons: ['reset', 'apply'] }}
              sortable={true}
            >
            </AgGridColumn>
            <AgGridColumn field="Last Sale"
              filter="agNumberColumnFilter"
              filterParams={{ buttons: ['reset', 'apply'] }}
              sortable={true} ></AgGridColumn>
            <AgGridColumn field="Net Change"
              filter="agNumberColumnFilter"
              filterParams={{ buttons: ['reset', 'apply'] }}
              sortable={true}  >
            </AgGridColumn>
            <AgGridColumn field="% Change"
              filter="agTextColumnFilter"
              sortable={true} ></AgGridColumn>
            <AgGridColumn field="Market Cap"
              filter="agTextColumnFilter"
              filterParams={marketCapParams}
              valueFormatter={marketCapFormatter}
              sortable={true} ></AgGridColumn>
            <AgGridColumn field="Country"
              filter="agTextColumnFilter"
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn field="IPO Year"
              filter="agTextColumnFilter"
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn field="Volume"
              filter="agTextColumnFilter"
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn field="Sector"
              filter="agTextColumnFilter"
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn field="Industry"
              filter="agTextColumnFilter"
              filterParams={{ buttons: ['reset', 'apply'] }}
              sortable={true}
            ></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default AgGridView;
