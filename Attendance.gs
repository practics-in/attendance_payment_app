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




function extractFormQnOptionsInMasterList(logComment, masterSpreadsheetId, sheetWithMasterList)  
{ 
  
  var masterSheet = SpreadsheetApp.openById(masterSpreadsheetId).getSheetByName(sheetWithMasterList); 
  var formQnOptions = masterSheet.getRange(2, 1, masterSheet.getLastRow()-1,1).getValues().filter(function(item)
                                                                                                  {
                                                                                                    return item != "";
                                                                                                  });
  
  Logger.log("Function extractFormQnOptionsInMasterList. \n Form qn options for " + logComment + ": \n" + formQnOptions);
  
  return formQnOptions;
}



function populateOptionsInForm(logComment,formId,formQnText,formQnFormat,formQnOptions)
{
  var form = FormApp.openById(formId);
  var formQnId = getFormItemId(formId,formQnText);    
  var formQn = [];
  
  Logger.log(logComment);
  
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
  formQn.setChoiceValues(formQnOptions);   
  
}
