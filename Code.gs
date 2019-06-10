function main()
{
  //populateForms();  // Works perfectly fine.
  attendanceProcessor("2019-06-05","2019-06-12");
}

function populateForms()
{
  populateAttendanceForm();
  populatePaymentForm();
  
}

function attendanceProcessor(startDate, endDate)
{
  var masterDataSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  var employeeMasterSheetName = "Employees list";
  var subcontractorMasterSheetName = "Subcontractor list";
  var siteMasterSheetName = "Site list";
  var shiftMasterSheetName = "Shifts";
  
  var formDataRecorderSpreadsheetId = "1wVCRHQZL9ieMh5bcmoT4Xr86ODe7xCNBv1Rh7LOwcdY";
  var attendanceRecorderSheetName = "Attendance Form Responses";
  var paymentRecorderSheetName = "Payment Form Responses";
  
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  
 // Works perfectly fine.
 // processEmployeeAttendance(formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
 //                            startDate, endDate, 
 //                             masterDataSpreadsheetId, employeeMasterSheetName, shiftMasterSheetName);
  
 var laborAttendanceRecords = processLaborAttendance(formDataRecorderSpreadsheetId, attendanceRecorderSheetName, 
                              startDate, endDate, 
                              masterDataSpreadsheetId, subcontractorMasterSheetName, shiftMasterSheetName);
 

  getLaborSummary(laborAttendanceRecords);
}
