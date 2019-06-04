function main()
{
  var masterSpreadsheetId = "1S9r4QWazXSWBskClf12iuV1v7GDExbAfCtxXb7yJLUQ";
  
  var empAttendanceFormId = "1kj76rXbSWrb7IC6hnTp8HHShd2D0RbrbABgl0Eo_ckU";
  var empSiteQnText = "Site";
  var empMasterSiteListSheetName = "Site list";
  var empShiftQnText = "Shift";
  var empMasterShiftListSheetName = "Shifts";
  var empAttendanceQnText = "Check box to mark attendance";
  var empMasterEmpListSheetName = "Employees list";
    
  
 populateFormQnWithMasterList("FILL SITE LIST", empAttendanceFormId, empSiteQnText, masterSpreadsheetId, empMasterSiteListSheetName, "DROP_DOWN");
 populateFormQnWithMasterList("FILL SHIFT LIST", empAttendanceFormId, empShiftQnText, masterSpreadsheetId, empMasterShiftListSheetName, "MULTIPLE_CHOICE");
 populateFormQnWithMasterList("FILL EMPLOYEE LIST", empAttendanceFormId, empAttendanceQnText, masterSpreadsheetId, empMasterEmpListSheetName, "CHECK_BOX")

}
