function processEmployeeAttendance( formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
                                     startDate, endDate, 
                                     masterDataSpreadsheetId, employeeMasterSheetName, shiftMasterSheetName)
{ 
  var attendanceRecords = sheetDataToArray(formDataRecorderSpreadsheetId, attendanceRecorderSheetName);
  var employeeMasterData = sheetDataToArray(masterDataSpreadsheetId,employeeMasterSheetName);
  
  
  var employeeSearchText = "Employees";
  var employeeAttendanceForPeriod = getAttendanceForPeriod(attendanceRecords, startDate, endDate, employeeSearchText);    
  var employeeAttendanceInJSONArray = twoDimensionArrayToJSONArray(employeeAttendanceForPeriod);
  var employeeMasterDataInJSONArray = twoDimensionArrayToJSONArray(employeeMasterData);
  
  var shiftMasterData = sheetDataToArray(masterDataSpreadsheetId,shiftMasterSheetName);
  var shiftMasterDataInJSONArray = twoDimensionArrayToJSONArray(shiftMasterData);  
  
  var employeeAllRecordsInJSONArray = mergeEmployeeAttendanceWithOtherData(employeeAttendanceInJSONArray,employeeMasterDataInJSONArray,
                                                                                    shiftMasterDataInJSONArray);
  
  calculatePaymentForEmployees("SITE_LEVEL",employeeAllRecordsInJSONArray);
  //TODO
  // this function returns a value.
    
}



function processLaborAttendance(formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
                                startDate, endDate, 
                                masterDataSpreadsheetId, subcontractorMasterSheetName, shiftMasterSheetName)
{
   
  var attendanceRecords = sheetDataToArray(formDataRecorderSpreadsheetId, attendanceRecorderSheetName);

  var subcontractorMasterData = sheetDataToArray(masterDataSpreadsheetId,subcontractorMasterSheetName);
  var subcontractorSearchText = "Labor";
  var subcontractorAttendanceForPeriod = getAttendanceForPeriod(attendanceRecords, startDate, endDate, subcontractorSearchText);  
  var subcontractorMasterDataInJSONArray = twoDimensionArrayToJSONArray(subcontractorMasterData);
  var subcontractorAttendanceInJSONArray = twoDimensionArrayToJSONArray(subcontractorAttendanceForPeriod); 

  var shiftMasterData = sheetDataToArray(masterDataSpreadsheetId,shiftMasterSheetName);
  var shiftMasterDataInJSONArray = twoDimensionArrayToJSONArray(shiftMasterData);    
  
  //Shift field headers in Master data
  var shiftHeaderInMasterData = "Shift"; 
  var shiftWeightHeaderInMasterData = "Weightage of day";
  
  // Logger.log(subcontractorMasterDataInJSONArray);
  // Logger.log("###############"); 
  // Logger.log(subcontractorAttendanceInJSONArray);
  
  
  // field Headers in subcontractor master sheet
  var subcontractorIDHeader = "Subcontractor ID";
  var subcontractorNameHeader = "Subcontractor Name";
  var subcontractorCategoryHeader = "Subcontractor Category";
  var subcontractorDropdownNameHeader = "Dropdown Name";
  var daySalaryMaleHeader = "Salary per day - Male";
  var daySalaryFemaleHeader = "Salary per day - Female";
  
  //field headers in Labor attendance record.
  var siteNameHeader = "Site";
  var shiftNameHeader = "Shift";
  var dateOfAttendanceHeader = "Timestamp";
  
  var subcontractor_1_Header = "Subcontractor #1";	
  var maleCount_1_Header = "Number of males for #1 (optional)"	;
  var femaleCount_1_Header = "Number of females for #1 (optional)";
  
  var subcontractor_2_Header = "Subcontractor #2 (optional)";
  var maleCount_2_Header = "Number of males for #2 (optional)";
  var femaleCount_2_Header = "Number of females for #2 (optional)";
  
  var subcontractor_3_Header = "Subcontractor #3 (optional)";
  var maleCount_3_Header = "Number of males for #3 (optional)";
  var femaleCount_3_Header = "Number of females for #3 (optional)";
  
  var subcontractor_4_Header = "Subcontractor #4 (optional)";
  var maleCount_4_Header = "Number of males for #4 (optional)";
  var femaleCount_4_Header = "Number of females for #4 (optional)";
  
  var subcontractor_5_Header = "Subcontractor #5 (optional)";
  var maleCount_5_Header = "Number of males for #5 (optional)";
  var femaleCount_5_Header = "Number of females for #5 (optional)";
  
  var commentsHeader = "Comments (optional)";
 
  var subcontractorAllRecordsInJSONArray = [];
  
 
  subcontractorAttendanceInJSONArray.forEach(function(subcontractorAttendanceEntry)
                                             {
                                               
                                               //var subcontractorList = [];
                                               for ( subcontractorCount = 1; subcontractorCount <= 5; subcontractorCount++)
                                               {

                                                 var subContractorFullRecordInJSON = new Object();
                                                 var subcontractorHeader = "subcontractor_" + subcontractorCount + "_Header";
                                                 var maleCountHeader = "maleCount_" + subcontractorCount + "_Header";
                                                 var femaleCountHeader = "femaleCount_" + subcontractorCount + "_Header";
                                               
                                                 if ( subcontractorAttendanceEntry[eval(subcontractorHeader)] != "")
                                                   {
                                                     //Logger.log(eval(subcontractorHeader));
                                                     //Logger.log(subcontractorAttendanceEntry[eval(subcontractorHeader)]);
                                                     
                                                     var subcontractorMasterJSONEntry = new Object();
                                                     subcontractorMasterDataInJSONArray.forEach(function(item)
                                                                                                {
                                                                                                  //Logger.log(item[subcontractorDropdownNameHeader]);
                                                                                                  //Logger.log(subcontractorAttendanceEntry);
                                                                                                  //Logger.log(subcontractorAttendanceEntry[subcontractorHeader]);
                                                                                                  if (item[subcontractorDropdownNameHeader] ==  subcontractorAttendanceEntry[eval(subcontractorHeader)])
                                                                                                  {
                                                                                                   // Logger.log(item);
                                                                                                    subcontractorMasterJSONEntry = item;
                                                                                                  }
                                                                                                })
                                                     
                                                     //Logger.log(subcontractorMasterJSONEntry);
                                                     //Logger.log(subcontractorIDHeader);
                                                     subContractorFullRecordInJSON[subcontractorIDHeader] = subcontractorMasterJSONEntry[subcontractorIDHeader];
                                                     subContractorFullRecordInJSON[subcontractorNameHeader] = subcontractorMasterJSONEntry[subcontractorNameHeader];
                                                     subContractorFullRecordInJSON[subcontractorCategoryHeader] = subcontractorMasterJSONEntry[subcontractorCategoryHeader];
                                                     subContractorFullRecordInJSON[siteNameHeader] = subcontractorAttendanceEntry[siteNameHeader];
                                                     subContractorFullRecordInJSON["Date"] = getDateInDDMMMYYYY(subcontractorAttendanceEntry[dateOfAttendanceHeader]);
                                                     subContractorFullRecordInJSON[shiftNameHeader] = subcontractorAttendanceEntry[shiftNameHeader];
                                                     subContractorFullRecordInJSON["Shift Weightage"] = getShiftWeightage(subcontractorAttendanceEntry[shiftNameHeader], shiftHeaderInMasterData, 
                                                                                                                         shiftWeightHeaderInMasterData, shiftMasterDataInJSONArray);
                                                     
                                                     
                                                     subContractorFullRecordInJSON["No. of males"] =  subcontractorAttendanceEntry[eval(maleCountHeader)];
                                                     subContractorFullRecordInJSON[daySalaryMaleHeader] = subcontractorMasterJSONEntry[daySalaryMaleHeader];
                                                     subContractorFullRecordInJSON["No. of females"] = subcontractorAttendanceEntry[eval(femaleCountHeader)];
                                                     subContractorFullRecordInJSON[daySalaryFemaleHeader] = subcontractorMasterJSONEntry[daySalaryFemaleHeader];
                                                     subContractorFullRecordInJSON["Total pay for the shift"] = ((subContractorFullRecordInJSON["No. of males"] * subContractorFullRecordInJSON[daySalaryMaleHeader]) 
                                                                                                                 + (subContractorFullRecordInJSON["No. of females"] * subContractorFullRecordInJSON[daySalaryFemaleHeader] ))
                                                                                                                 * subContractorFullRecordInJSON["Shift Weightage"];
                                                     //Logger.log(subContractorFullRecordInJSON);
                                                     subcontractorAllRecordsInJSONArray.push(subContractorFullRecordInJSON);
                                                     
                                                   }
                                                }      
                                             })
  
/* Fields in each attendance entry:  

SubContractor ID 
SubContractor Name 
SubContractor Category
Site 
Date 
Shift 
No. Of Males 
Male Salary per day 
No. of Females 
Female Salary per day 
Total pay for the shift 

*/
  
  Logger.log(subcontractorAllRecordsInJSONArray);
  
  return subcontractorAllRecordsInJSONArray;
}



