function populateAttendanceForm()
{
  var masterSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  var attendanceFormId = "1kj76rXbSWrb7IC6hnTp8HHShd2D0RbrbABgl0Eo_ckU";
  
  var masterSiteListSheetName = "Site list";
  var masterShiftListSheetName = "Shifts";
  var empMasterListSheetName = "Employees list";
  var subcontractorMasterListSheetName = "Subcontractor list";
  
  var siteQnText = "Site";
  var shiftQnText = "Shift";  
  var subcontractorQnText_1 =  "Subcontractor #1";
  var subcontractorQnText_2 =  "Subcontractor #2 (optional)";
  var subcontractorQnText_3 =  "Subcontractor #3 (optional)";
  var subcontractorQnText_4 =  "Subcontractor #4 (optional)";
  var subcontractorQnText_5 =  "Subcontractor #5 (optional)"; 
  var empAttendanceQnText = "Check box to mark attendance";
  
  var siteList = extractFormQnOptionsInMasterList(masterSpreadsheetId, masterSiteListSheetName);
  var shiftList = extractFormQnOptionsInMasterList(masterSpreadsheetId, masterShiftListSheetName);  
  var subcontractorList = extractFormQnOptionsInMasterList(masterSpreadsheetId, subcontractorMasterListSheetName); 
  var empList = extractFormQnOptionsInMasterList(masterSpreadsheetId, empMasterListSheetName);
  
  populateOptionsInForm(attendanceFormId, siteQnText,"DROP_DOWN", siteList);
  populateOptionsInForm(attendanceFormId, shiftQnText,"MULTIPLE_CHOICE", shiftList);
  populateOptionsInForm(attendanceFormId, empAttendanceQnText,"CHECK_BOX", empList);
  
  populateOptionsInForm(attendanceFormId, subcontractorQnText_1,"DROP_DOWN", subcontractorList);
  populateOptionsInForm(attendanceFormId, subcontractorQnText_2,"DROP_DOWN", subcontractorList);
  populateOptionsInForm(attendanceFormId, subcontractorQnText_3,"DROP_DOWN", subcontractorList);
  populateOptionsInForm(attendanceFormId, subcontractorQnText_4,"DROP_DOWN", subcontractorList);
  populateOptionsInForm(attendanceFormId, subcontractorQnText_5,"DROP_DOWN", subcontractorList);
  
}


function populatePaymentForm()
{
  var masterSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  var paymentFormId = "1HS7TMM0xs5cbdV94EnvB0HLTz489ed0D8psJbzFickE";
  
  var masterSiteListSheetName = "Site list";
  var subcontractorMasterListSheetName = "Subcontractor list";
  var empMasterListSheetName = "Employees list";
  
  var siteQnText = "Site:";  
  var subcontractorNameQnText = "Subcontractor:";
  var empNameQnText = "Employee Name:";
  
  var siteList = extractFormQnOptionsInMasterList(masterSpreadsheetId, masterSiteListSheetName);
  var subcontractorList = extractFormQnOptionsInMasterList(masterSpreadsheetId, subcontractorMasterListSheetName); 
  var empList = extractFormQnOptionsInMasterList(masterSpreadsheetId, empMasterListSheetName);
  
  populateOptionsInForm(paymentFormId, siteQnText,"DROP_DOWN", siteList);
  populateOptionsInForm(paymentFormId, subcontractorNameQnText,"DROP_DOWN", subcontractorList);
  populateOptionsInForm(paymentFormId, empNameQnText,"DROP_DOWN", empList);
  
  
}
