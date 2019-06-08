function getShiftWeightage(shiftName, shiftHeaderInMasterData, shiftWeightHeaderInMasterData, shiftMasterDataInJSONArray)
{
  var shiftWeight = -1000;
  for ( var i = 0; i < shiftMasterDataInJSONArray.length; i++)
  {
    if (shiftMasterDataInJSONArray[i][shiftHeaderInMasterData] == shiftName)
    {
      shiftWeight = shiftMasterDataInJSONArray[i][shiftWeightHeaderInMasterData];
    }    
  }
  return shiftWeight;
}




function getAttendanceForPeriod(attendanceRecords, startDate, endDate, searchText)
{
  var attendanceRecordsForPeriod = [attendanceRecords[0]];
  attendanceRecords.forEach(function(item)
                            { 
                              if (item[0] >= startDate && item[0] <= endDate && item[4] == searchText)
                              {
                                attendanceRecordsForPeriod.push(item);
                              }
                            })
  
  return attendanceRecordsForPeriod;
}

