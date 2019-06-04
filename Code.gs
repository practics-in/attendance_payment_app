function main()
{
  populateAttendanceForm();
  populatePaymentForm();
  
}




function populateAttendanceForm()
{
  var masterSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  var attendanceFormId = "1kj76rXbSWrb7IC6hnTp8HHShd2D0RbrbABgl0Eo_ckU";
  
  var masterSiteListSheetName = "Site list";
  var masterShiftListSheetName = "Shifts";
  var empMasterListSheetName = "Employees list";
  var subcontractorMasterListSheetName = "Sub-contractor list";
  
  var siteQnText = "Site";
  var shiftQnText = "Shift";  
  var subcontractorQnText_1 =  "Sub-Contractor #1";
  var subcontractorQnText_2 =  "Sub-Contractor #2 (optional)";
  var subcontractorQnText_3 =  "Sub-Contractor #3 (optional)";
  var subcontractorQnText_4 =  "Sub-Contractor #4 (optional)";
  var subcontractorQnText_5 =  "Sub-Contractor #5 (optional)"; 
  var empAttendanceQnText = "Check box to mark attendance";
  
  var siteList = extractFormQnOptionsInMasterList("EXTRACT SITE LIST", masterSpreadsheetId, masterSiteListSheetName);
  var shiftList = extractFormQnOptionsInMasterList("EXTRACT SHIFT LIST", masterSpreadsheetId, masterShiftListSheetName);  
  var subcontractorList = extractFormQnOptionsInMasterList("EXTRACT SUB-CONTRACTOR LIST", masterSpreadsheetId, subcontractorMasterListSheetName); 
  var empList = extractFormQnOptionsInMasterList("EXTRACT EMPLOYEE LIST", masterSpreadsheetId, empMasterListSheetName);

  populateOptionsInForm("POPULATE SITE LIST", attendanceFormId, siteQnText,"DROP_DOWN", siteList);
  populateOptionsInForm("POPULATE SHIFT LIST", attendanceFormId, shiftQnText,"MULTIPLE_CHOICE", shiftList);
  populateOptionsInForm("POPULATE EMPLOYEE LIST", attendanceFormId, empAttendanceQnText,"CHECK_BOX", empList);
  
  populateOptionsInForm("POPULATE SUB-CONTRACTOR #1 LIST", attendanceFormId, subcontractorQnText_1,"DROP_DOWN", subcontractorList);
  populateOptionsInForm("POPULATE SUB-CONTRACTOR #2 LIST", attendanceFormId, subcontractorQnText_2,"DROP_DOWN", subcontractorList);
  populateOptionsInForm("POPULATE SUB-CONTRACTOR #3 LIST", attendanceFormId, subcontractorQnText_3,"DROP_DOWN", subcontractorList);
  populateOptionsInForm("POPULATE SUB-CONTRACTOR #4 LIST", attendanceFormId, subcontractorQnText_4,"DROP_DOWN", subcontractorList);
  populateOptionsInForm("POPULATE SUB-CONTRACTOR #5 LIST", attendanceFormId, subcontractorQnText_5,"DROP_DOWN", subcontractorList);

}


function populatePaymentForm()
{
  var masterSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  var paymentFormId = "1HS7TMM0xs5cbdV94EnvB0HLTz489ed0D8psJbzFickE";
  
  var masterSiteListSheetName = "Site list";
  var subcontractorMasterListSheetName = "Sub-contractor list";
  var empMasterListSheetName = "Employees list";
  
  var siteQnText = "Site:";  
  var subcontractorNameQnText = "Sub-Contractor:";
  var empNameQnText = "Employee Name:";
  
  var siteList = extractFormQnOptionsInMasterList("EXTRACT SITE LIST", masterSpreadsheetId, masterSiteListSheetName);
  var subcontractorList = extractFormQnOptionsInMasterList("EXTRACT SUB-CONTRACTOR LIST", masterSpreadsheetId, subcontractorMasterListSheetName); 
  var empList = extractFormQnOptionsInMasterList("EXTRACT EMPLOYEE LIST", masterSpreadsheetId, empMasterListSheetName);

  populateOptionsInForm("POPULATE SITE LIST", paymentFormId, siteQnText,"DROP_DOWN", siteList);
  populateOptionsInForm("POPULATE SUB-CONTRACTOR LIST", paymentFormId, subcontractorNameQnText,"DROP_DOWN", subcontractorList);
  populateOptionsInForm("POPULATE EMPLOYEE LIST", paymentFormId, empNameQnText,"DROP_DOWN", empList);
  
  
}
