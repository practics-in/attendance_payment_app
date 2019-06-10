
function mergeEmployeeAttendanceWithOtherData(attendanceInJSONArray,masterEmpDataInJSONArray,
                                              shiftMasterDataInJSONArray)  
{
  var intermediateJSONArray = [];
  
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
  masterEmpDataInJSONArray.forEach(function(employee)  // for each employee in master database
                                   {
                                     var jsonLineEntry = new Object();
                                     jsonLineEntry[empId] = employee[empId];
                                     jsonLineEntry[empName] = employee[empName];
                                     jsonLineEntry[empPerDaySalary] = employee[empPerDaySalary]; 
                                     jsonLineEntry[empGender] = employee[empGender];
                                     jsonLineEntry[empComment] = employee[empComment];
                                     intermediateJSONArray.push(jsonLineEntry);                   
                                   })
  
  
  
  var attendanceAndPaymentRecordsInJSONArray = []; 
  intermediateJSONArray.forEach(function(employeeEntry)  
                                {
                                  attendanceInJSONArray.forEach(function(attendanceRecord) 
                                                                {
                                                                  employeeEntry = JSON.parse(JSON.stringify(employeeEntry));
                                                                  if(attendanceRecord[empAttendanceList].indexOf(employeeEntry[empName]) != -1)
                                                                  {
                                                                    employeeEntry[siteName] = attendanceRecord[siteName];
                                                                    employeeEntry[shiftName] = attendanceRecord[shiftName];
                                                                    employeeEntry["Date"] = attendanceRecord[dateOfAttendance];
                                                                    employeeEntry["Shift Weightage"] = getShiftWeightage(attendanceRecord[shiftName], shiftHeaderInMasterData, 
                                                                                                                         shiftWeightHeaderInMasterData, shiftMasterDataInJSONArray);
                                                                    attendanceAndPaymentRecordsInJSONArray.push(employeeEntry);
                                                                  }
                                                                })
                                })
 
  return attendanceAndPaymentRecordsInJSONArray;
}


function calculatePaymentForEmployees(returnChoice,attendanceAndPaymentRecordsInJSONArray)
{
  
  
  var employeeSitewisePaymentSummaryJSONArray = [];
  var employeeTotalSalaryForPeriodJSONArray = [];
  
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
                                                              for ( var i = 0, arrayLength = attendanceAndPaymentRecordsInJSONArray.length; i < arrayLength ; i++)
                                                              {
                                                                if ( attendanceAndPaymentRecordsInJSONArray[i][empIdKeyName] === employeeId  && attendanceAndPaymentRecordsInJSONArray[i][siteKeyName] === site )
                                                                {
                                                                  totalDaysWorkedOnSite = totalDaysWorkedOnSite + attendanceAndPaymentRecordsInJSONArray[i][shiftWeightageKeyName];
                                                                  dateAndShift = getDateInDDMMMYYYY(attendanceAndPaymentRecordsInJSONArray[i][dateKeyName]) + " @ " + attendanceAndPaymentRecordsInJSONArray[i][shiftKeyName] + "(" + attendanceAndPaymentRecordsInJSONArray[i][shiftWeightageKeyName] +" days)";
                                                                  dateAndShiftRecords.push(dateAndShift);
                                                                  empName = attendanceAndPaymentRecordsInJSONArray[i][empNameKey];
                                                                  empPerDaySalary = attendanceAndPaymentRecordsInJSONArray[i][empPerDaySalaryKeyName];
                                                                  
                                                                }
                                                               
                                                              }
                                                              totalPayOnSiteForThePeriod = totalDaysWorkedOnSite * empPerDaySalary;
                                                              
                                                              if ( totalDaysWorkedOnSite !== 0 )
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

