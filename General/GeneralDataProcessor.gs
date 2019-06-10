
function sheetDataToArray(masterSpreadsheetId, sheetName) {
  
  var dataSheet = SpreadsheetApp.openById(masterSpreadsheetId).getSheetByName(sheetName);
  var data = dataSheet.getRange(1, 1, dataSheet.getLastRow(), dataSheet.getLastColumn())
  .getValues().filter(function(item)
                      { if (item[0] != "")
                      { return item;}
                      });  
  return data;
}




function twoDimensionArrayToJSONArray(arrayWithHeaders)
{
  var jsonArray = [];
  for( var i=1, numberOfEntries = arrayWithHeaders.length ; i < numberOfEntries; i++)
  {
    var jsonLineEntry = new Object();
    for (var j=0, numberOfHeaders = arrayWithHeaders[0].length; j < numberOfHeaders; j++)
    {
      jsonLineEntry[arrayWithHeaders[0][j]] = arrayWithHeaders[i][j]; 
    }
    jsonArray.push(jsonLineEntry);
  }
  return jsonArray;
}



function getUniqueFieldValuesFromJSONArray(fieldKeyName, jsonArray)
{
  var uniqueValuesArray = [];  
  for (var i = 0, arrayLength = jsonArray.length; i < arrayLength; i++)
  {
    if ( uniqueValuesArray.indexOf(jsonArray[i][fieldKeyName]) == -1 )
    {
      uniqueValuesArray.push(jsonArray[i][fieldKeyName]);
    }    
  }
  return uniqueValuesArray.sort();
}



function getDateInDDMMMYYYY(dateInput) 
{  
  const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]; 
  var dateInFormat = dateInput.getDate() + "-" + months[dateInput.getMonth()] + "-" + dateInput.getFullYear() ;
  return dateInFormat;
}

