function processAttendanceAndPayment(logComment, formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
                                     startDate, endDate, 
                                     masterDataSpreadsheetId, employeeMasterSheetName, subcontractorMasterSheetName, 
                                     siteMasterSheetName, shiftMasterSheetName)
{ 
  var attendanceRecords = sheetDataToArray(formDataRecorderSpreadsheetId, attendanceRecorderSheetName);
  var employeeMasterData = sheetDataToArray(masterDataSpreadsheetId,employeeMasterSheetName);
  var subcontractorMasterData = sheetDataToArray(masterDataSpreadsheetId,subcontractorMasterSheetName);
  var siteMasterData = sheetDataToArray(masterDataSpreadsheetId, siteMasterSheetName);
  var shiftMasterData = sheetDataToArray(masterDataSpreadsheetId,shiftMasterSheetName);
  
  var employeeSearchText = "Employees";
  var employeeAttendanceForPeriod = getAttendanceForPeriod(attendanceRecords, startDate, endDate, employeeSearchText);    
  
  var subcontractorSearchText = "Labor";
  var subcontractorAttendanceForPeriod = getAttendanceForPeriod(attendanceRecords, startDate, endDate, subcontractorSearchText);  
  
  var employeeAttendanceInJSONArray = twoDimensionArrayToJSONArray(employeeAttendanceForPeriod);
  var subcontractorAttendanceInJSONArray = twoDimensionArrayToJSONArray(subcontractorAttendanceForPeriod);
  var employeeMasterDataInJSONArray = twoDimensionArrayToJSONArray(employeeMasterData);
  var subcontractorMasterDataInJSONArray = twoDimensionArrayToJSONArray(subcontractorMasterData);
  var siteMasterDataInJSONArray = twoDimensionArrayToJSONArray(siteMasterData);
  var shiftMasterDataInJSONArray = twoDimensionArrayToJSONArray(shiftMasterData);
   
  var attendanceAndPaymentRecordsInJSONArray = mergeEmployeeAttendanceWithOtherData(employeeAttendanceInJSONArray,employeeMasterDataInJSONArray,
                                                                                    shiftMasterDataInJSONArray);
  
  
  calculatePaymentForEmployees("SITE_LEVEL",attendanceAndPaymentRecordsInJSONArray);
  //TODO
  // this function returns a value.
    
}
