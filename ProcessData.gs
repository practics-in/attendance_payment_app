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
                                                                                    shiftMasterDataInJSONArray);
  
  
  calculatePaymentForEmployees("SITE_LEVEL",attendanceAndPaymentRecordsInJSONArray);
  
  
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


function getShiftWeightage(shiftName, shiftHeaderInMasterData, shiftWeightHeaderInMasterData, shiftMasterDataInJSONArray)
{
  var shiftWeight = -1000;
  // Logger.log(shiftMasterDataInJSONArray);
  for ( var i = 0; i < shiftMasterDataInJSONArray.length; i++)
  {
    //Logger.log(shiftMasterDataInJSONArray[i][shiftHeaderInMasterData]);
    //Logger.log(shiftName);
    
    if (shiftMasterDataInJSONArray[i][shiftHeaderInMasterData] == shiftName)
    {
      shiftWeight = shiftMasterDataInJSONArray[i][shiftWeightHeaderInMasterData];
      //     Logger.log(shiftWeight);
    }    
  }
  //Logger.log("Shift weight for " + shiftName + " : " + shiftWeight);
  return shiftWeight;
}


function mergeEmployeeAttendanceWithOtherData(attendanceInJSONArray,masterEmpDataInJSONArray,
                                              shiftMasterDataInJSONArray)   // Does only for Employee.
{
  var intermediateJSONArray = new Array();
  
  //Employee field headers in Master data
  var empId = "Employee ID";
  var empName = "Employee Name";
  var empPerDaySalary = "Salary per day";
  var empGender = "Gender";
  var empComment = "Comment";
  
  //Shift field headers in Master data
  var shiftHeaderInMasterData = "Shift"; 
  var shiftWeightHeaderInMasterData = "Weightage of day";
  
  //Field headers from Attendance Recorder
  var siteName = "Site";
  var shiftName = "Shift";
  var dateOfAttendance = "Timestamp";
  var empAttendanceList = "Check box to mark attendance";
  
  
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
                                                                    employeeEntry["Date"] = attendanceRecord[dateOfAttendance];
                                                                    
                                                                    //getDateInDDMMMYYYY(attendanceRecord[dateOfAttendance]);
                                                                    
                                                                    employeeEntry["Shift Weightage"] = getShiftWeightage(attendanceRecord[shiftName], shiftHeaderInMasterData, 
                                                                                                                         shiftWeightHeaderInMasterData, shiftMasterDataInJSONArray);
                                                                    // Add shift weightage to data.
                                                                    // Calculate total days worked, site wise.
                                                                    // Calculate total pay, site wise.
                                                                    
                                                                    attendanceAndPaymentRecordsInJSONArray.push(employeeEntry);
                                                                  }
                                                                })
                                })
  
  
  //  Logger.log(attendanceAndPaymentRecordsInJSONArray);
  
  return attendanceAndPaymentRecordsInJSONArray;
}


function getUniqueFieldValuesFromJSONArray(fieldKeyName, jsonArray)
{
  var uniqueValuesArray = [];
  
  for (var i = 0; i < jsonArray.length; i++)
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
  
  //dateInput = Date.parse(dateInput)
  
  var dateInFormat = dateInput.getDate() + "-" + months[dateInput.getMonth()] + "-" + dateInput.getFullYear() ;
  
  //Logger.log("Input format: " + dateInput.toString() + " Formatted date: " + dateInFormat);
  return dateInFormat;
}


function calculatePaymentForEmployees(returnChoice,attendanceAndPaymentRecordsInJSONArray)  // INCOMPLETE
{
  
  
  var employeeSitewisePaymentSummaryJSONArray = [];
  var employeeTotalSalaryForPeriodJSONArray = [];
  // Get unique site list from attendance records into an array
  // creating a unique entry for employee-site combo.
  
  // for each employee 
       // get list of unique sites. reset total days to zero. create a new json entry.
            // for each site create array of dates (in dd-MMM-YYYY IST format) " @ " shifts. Add the cumulative days as per shift weightage 
       // append the "dates-shifts" array to the json.
  // multiply total days for the site * salary per day. 
  
  var empIdKeyName = "Employee ID";
  var empNameKey = "Employee Name";
  var siteKeyName = "Site";
  var shiftKeyName = "Shift";
  var shiftWeightageKeyName = "Shift Weightage";
  var dateKeyName = "Date";
  var empPerDaySalaryKeyName = "Salary per day";
  
  
  var listOfEmployeesInData = getUniqueFieldValuesFromJSONArray(empIdKeyName,attendanceAndPaymentRecordsInJSONArray);
  var listOfSitesInData = getUniqueFieldValuesFromJSONArray(siteKeyName,attendanceAndPaymentRecordsInJSONArray);
  
  
  listOfEmployeesInData.forEach(function(employeeId)
                                {
                                  
                                  var totalSalaryForThePeriod = 0;
                                  var totalDaysWorkedInThePeriod = 0;
                                  var empName = "";
                                  var empPerDaySalary = -1000;
                                  var employeeSalaryForPeriodJSON = new Object();
                                  listOfSitesInData.forEach(function(site)
                                                            {
                                                              var sitewiseEmployeePaymentRecordJSON = new Object();
                                                              var totalDaysWorkedOnSite = 0;
                                                              var totalPayOnSiteForThePeriod = 0;
                                                              var dateAndShiftRecords = [];
                                                              var dateAndShift = "";
                                                              for ( var i = 0; i < attendanceAndPaymentRecordsInJSONArray.length; i++)
                                                              {
                                                                if ( attendanceAndPaymentRecordsInJSONArray[i][empIdKeyName] == employeeId  && attendanceAndPaymentRecordsInJSONArray[i][siteKeyName] == site )
                                                                {
                                                                 // Logger.log("Shift weightage: " + attendanceAndPaymentRecordsInJSONArray[i][shiftWeightageKeyName]);
                                                                  totalDaysWorkedOnSite = totalDaysWorkedOnSite + attendanceAndPaymentRecordsInJSONArray[i][shiftWeightageKeyName];
                                                                  dateAndShift = getDateInDDMMMYYYY(attendanceAndPaymentRecordsInJSONArray[i][dateKeyName]) + " @ " + attendanceAndPaymentRecordsInJSONArray[i][shiftKeyName] + "(" + attendanceAndPaymentRecordsInJSONArray[i][shiftWeightageKeyName] +" days)";
                                                                  dateAndShiftRecords.push(dateAndShift);
                                                                  empName = attendanceAndPaymentRecordsInJSONArray[i][empNameKey];
                                                                  empPerDaySalary = attendanceAndPaymentRecordsInJSONArray[i][empPerDaySalaryKeyName];
                                                                  
                                                                }
                                                               
                                                              }
                                                              totalPayOnSiteForThePeriod = totalDaysWorkedOnSite * empPerDaySalary;
                                                             // Logger.log("For employee : " + empName + ". Day & shift he/she worked are: " + dateAndShiftRecords); 
                                                             // Logger.log("For employee : " + empName + ". \n The salary per day for the employees is: "+ empPerDaySalary +" \n total Days worked = " + totalDaysWorkedOnSite + " \n\n\nTherefore, total pay for the period = " + totalPayOnSiteForThePeriod);                                     
                                                              
                                                              if ( totalDaysWorkedOnSite != 0 )
                                                              {
                                                              sitewiseEmployeePaymentRecordJSON[empIdKeyName] = employeeId;
                                                              sitewiseEmployeePaymentRecordJSON[empNameKey] = empName;
                                                              sitewiseEmployeePaymentRecordJSON[siteKeyName] = site;
                                                              sitewiseEmployeePaymentRecordJSON["Dates & Shifts"] = dateAndShiftRecords;
                                                              sitewiseEmployeePaymentRecordJSON["Total Days Worked on Site"]  = totalDaysWorkedOnSite;
                                                              sitewiseEmployeePaymentRecordJSON[empPerDaySalaryKeyName] = empPerDaySalary;
                                                              sitewiseEmployeePaymentRecordJSON["Total Site Pay for the Period"] = totalPayOnSiteForThePeriod;
                                                              
                                                              totalSalaryForThePeriod = totalSalaryForThePeriod + totalPayOnSiteForThePeriod;
                                                              totalDaysWorkedInThePeriod = totalDaysWorkedInThePeriod + totalDaysWorkedOnSite;
                                                              employeeSitewisePaymentSummaryJSONArray.push(sitewiseEmployeePaymentRecordJSON);
                                                              }
                                                            })
                                  employeeSalaryForPeriodJSON[empIdKeyName] = employeeId;
                                  employeeSalaryForPeriodJSON[empNameKey] = empName;
                                  employeeSalaryForPeriodJSON["Total days worked in the Period"] = totalDaysWorkedInThePeriod;
                                  employeeSalaryForPeriodJSON[empPerDaySalaryKeyName] = empPerDaySalary;
                                  employeeSalaryForPeriodJSON["Total Salary for Period"] = totalSalaryForThePeriod;
                                  
                                  employeeTotalSalaryForPeriodJSONArray.push(employeeSalaryForPeriodJSON);
                                })
 
  Logger.log(employeeSitewisePaymentSummaryJSONArray);
  
  Logger.log("##########TOTAL Salary for period###############");
  Logger.log(employeeTotalSalaryForPeriodJSONArray);
  
  if (returnChoice = "SITE_LEVEL")
  {
    return employeeSitewisePaymentSummaryJSONArray;
  }
  else
  {
    return employeeTotalSalaryForPeriodJSONArray;
  }
}


// TODO
/// merge attendance with other data for Labor.
/// Calculate site wise payment for labor.


