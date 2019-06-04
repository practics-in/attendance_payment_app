function getFormItemId(formId,qnText) {
  
  var form = FormApp.openById(formId);
  var qnId = 0;
  
  form.getItems().forEach(function(item) {
    if (item.getTitle() == qnText)
    {   
      Logger.log("Function getFormItemId: " + item.getTitle() + ' ' + item.getId());
      qnId =  item.getId();
    }
             })
  
  return qnId;
}




function populateFormQnWithMasterList(logComment, formId,formQnText,masterSpreadsheetId,sheetWithMasterList, formQnFormat)  
{ 
  var masterSheet = SpreadsheetApp.openById(masterSpreadsheetId)
                       .getSheetByName(sheetWithMasterList); 
  var formQnOptions = masterSheet.getRange(2, 1, masterSheet.getLastRow()-1,1)
  
  Logger.log("Function populateFormQnWithMasterList. \n Form qn options for " + logComment + ": \n" + formQnOptions.getValues());
  
  var form = FormApp.openById(formId);
  var formQnId = getFormItemId(formId,formQnText);    
  var formQn = [];
  
  if(formQnFormat == "CHECK_BOX")
  { 
    formQn = form.getItemById(formQnId).asCheckboxItem();
  }
  else if (formQnFormat == "DROP_DOWN")
  {
    formQn = form.getItemById(formQnId).asListItem();
  }
  else if (formQnFormat == "MULTIPLE_CHOICE")
  {
    formQn = form.getItemById(formQnId).asMultipleChoiceItem();
  }
  else
  {
    formQn = form.getItemById(formQnId).asParagraphTextItem();
  }
  
        
  formQn.setChoiceValues(formQnOptions.getValues());   
}
