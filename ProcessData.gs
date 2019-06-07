function summaryProcessor()
{
  var masterDataSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  var employeeMasterSheetName = "Employees list";
  var subcontractorMasterSheetName = "Sub-contractor list";
  var siteMasterSheetName = "Site list";
  var shiftMasterSheetName = "Shifts";
  
  var formDataRecorderSpreadsheetId = "1wVCRHQZL9ieMh5bcmoT4Xr86ODe7xCNBv1Rh7LOwcdY";
  var attendanceRecorderSheetName = "Attendance Form Responses";
  var paymentRecorderSheetName = "Payment Form Responses";
  
  var startDate = new Date("2019-06-05T00:00:00+05:30");
  var endDate = new Date("2019-06-10T00:00:00+05:30");
  
  processAttendanceAndPayment("Process attendance", formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
                              startDate, endDate, 
                              masterDataSpreadsheetId, employeeMasterSheetName, subcontractorMasterSheetName, 
                              siteMasterSheetName, shiftMasterSheetName);
  
}


function gatherDataFromSheet(masterSpreadsheetId, sheetName) {
  
  var dataSheet = SpreadsheetApp.openById(masterSpreadsheetId).getSheetByName(sheetName);
  var data = dataSheet.getRange(1, 1, dataSheet.getLastRow(), dataSheet.getLastColumn())
  .getValues().filter(function(item)
                      { if (item[0] != "")
                      { return item;}
                      });  
  return data;
}


function processAttendanceAndPayment(logComment, formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
                                     startDate, endDate, 
                                     masterDataSpreadsheetId, employeeMasterSheetName, subcontractorMasterSheetName, 
                                     siteMasterSheetName, shiftMasterSheetName)
{ 
  //Get all data in Array format.
  var attendanceRecords = gatherDataFromSheet(formDataRecorderSpreadsheetId, attendanceRecorderSheetName);
  var employeeMasterData = gatherDataFromSheet(masterDataSpreadsheetId,employeeMasterSheetName);
  var subcontractorMasterData = gatherDataFromSheet(masterDataSpreadsheetId,subcontractorMasterSheetName);
  var siteMasterData = gatherDataFromSheet(masterDataSpreadsheetId, siteMasterSheetName);
  var shiftMasterData = gatherDataFromSheet(masterDataSpreadsheetId,shiftMasterSheetName);
  
  var employeeSearchText = "Employees";
  var employeeAttendanceForPeriod = getAttendanceForPeriod(attendanceRecords, startDate, endDate, employeeSearchText);    
  
  var subcontractorSearchText = "Labor";
  var subcontractorAttendanceForPeriod = getAttendanceForPeriod(attendanceRecords, startDate, endDate, subcontractorSearchText);  
  
  // Convert the Array-formatted data in JSON Format.
  var employeeAttendanceInJSONArray = arrayToJSONArray(employeeAttendanceForPeriod);
  //Logger.log(employeeAttendanceInJSONArray[0]["Check box to mark attendance"]);
  var subcontractorAttendanceInJSONArray = arrayToJSONArray(subcontractorAttendanceForPeriod);
  var employeeMasterDataInJSONArray = arrayToJSONArray(employeeMasterData);
  var subcontractorMasterDataInJSONArray = arrayToJSONArray(subcontractorMasterData);
  var siteMasterDataInJSONArray = arrayToJSONArray(siteMasterData);
  var shiftMasterDataInJSONArray = arrayToJSONArray(shiftMasterData);
  
  
  var attendanceAndPaymentRecordsInJSONArray = mergeEmployeeAttendanceWithOtherData(employeeAttendanceInJSONArray,employeeMasterDataInJSONArray,
                                                                                    siteMasterDataInJSONArray, shiftMasterDataInJSONArray);
  
  
  
  
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


function arrayToJSONArray(arrayWithHeaders)
{
  var jsonArray = new Array();
  for( var i=1; i < arrayWithHeaders.length; i++)
  {
    var jsonLineEntry = new Object();
    for (var j=0; j < arrayWithHeaders[0].length; j++)
    {
      jsonLineEntry[arrayWithHeaders[0][j]] = arrayWithHeaders[i][j]; 
    }
    jsonArray.push(jsonLineEntry);
  }
  return jsonArray;
}



function mergeEmployeeAttendanceWithOtherData(attendanceInJSONArray,masterEmpDataInJSONArray,
                                              siteMasterDataInJSONArray,shiftMasterDataInJSONArray)   // Does only for Employee.
{
  var intermediateJSONArray = new Array();

  //Employee field names in Master data
  empId = "Employee ID";
  empName = "Employee Name";
  empPerDaySalary = "Salary per day";
  empGender = "Gender";
  empComment = "Comment";
  
  //Field names from Attendance Recorder
  siteName = "Site";
  shiftName = "Shift";
  dateOfAttendance = "Timestamp";
  empAttendanceList = "Check box to mark attendance";
  
  
  // Forming the Attendance database
  masterEmpDataInJSONArray.forEach(function(item)  // for each employee in master database
                                   {
                                     //Logger.log(item[empId]);
                                     var jsonLineEntry = new Object();
                                     jsonLineEntry[empId] = item[empId];
                                     jsonLineEntry[empName] = item[empName];
                                     jsonLineEntry[empPerDaySalary] = item[empPerDaySalary]; 
                                     jsonLineEntry[empGender] = item[empGender];
                                     jsonLineEntry[empComment] = item[empComment];
                                     intermediateJSONArray.push(jsonLineEntry);             // push into an intermediate JSON Array.        
                                   })
  
  var attendanceAndPaymentRecordsInJSONArray = []; 
  intermediateJSONArray.forEach(function(employeeEntry)  // for each employee entry from master list  ##### HAVE TO TELL CODE TO TAKE employeeEntry as JSON Object.
                                {
                                  
                                  attendanceInJSONArray.forEach(function(attendanceRecord) // go through each attendance record
                                                                {
                                                                  employeeEntry = JSON.parse(JSON.stringify(employeeEntry));
                                                                  if(attendanceRecord[empAttendanceList].indexOf(employeeEntry[empName]) != -1)
                                                                  {
                                                                    employeeEntry[siteName] = attendanceRecord[siteName];
                                                                    employeeEntry[shiftName] = attendanceRecord[shiftName];
                                                                    employeeEntry[dateOfAttendance] = attendanceRecord[dateOfAttendance];
                                                                    // Add shift weightage to data.
                                                                    // Calculate total days worked, site wise.
                                                                    // Calculate total pay, site wise.
                                                                    
                                                                    attendanceAndPaymentRecordsInJSONArray.push(employeeEntry);
                                                                  }
                                                                })
                                })
  
  
  return attendanceAndPaymentRecordsInJSONArray;
}


function calculateSiteWisePaymentForEmployee(attendanceAndPaymentRecordsInJSONArray, masterEmpDataInJSONArray)  // INCOMPLETE
{
  
  var paymentSummaryJSON = new Object();
  /*paymentSummary["Employee Id"] = employeeEntry[empId];
  paymentSummary["Employee Name"] = employeeEntry[empName];
  paymentSummary["Salary per day"] = employeeEntry[empPerDaySalary];
  */
  var totalDaysWorked = 0;
  var totalPayForPeriod = 0;
}

// TODO
/// merge attendance with other data for Labor.
/// Calculate site wise payment for labor.


