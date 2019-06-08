function populateForms()
{
  populateAttendanceForm();
  populatePaymentForm();
  
}


function attendanceProcessor()
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
