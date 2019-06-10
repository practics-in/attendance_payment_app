function getLaborSummary(laborAttendanceRecordsJSONArray)
{
  
  var subcontractorIDHeader = "Subcontractor ID";
  var subcontractorNameHeader = "Subcontractor Name";
  var subcontractorCategoryHeader = "Subcontractor Category";
  var payForShiftHeader = "Total pay for the shift";
  var uniqueSubcontractorList = getUniqueFieldValuesFromJSONArray(subcontractorIDHeader,laborAttendanceRecordsJSONArray);
  
  var laborPaymentSummary = [];
  
  Logger.log(uniqueSubcontractorList);
  uniqueSubcontractorList.forEach(function(subcontractorID)
                                  {
                                    
                                    var subcontractorName = "";
                                    var subcontractorCategory = "";
                                    var subcontractorEntry = new Object();
                                    var totalPayForPeriod = 0;
                                    laborAttendanceRecordsJSONArray.forEach(function(item)
                                                                            { 
                                                                              if (item[subcontractorIDHeader] == subcontractorID)
                                                                              {
                                                                                if (subcontractorName == "")
                                                                                {
                                                                                  subcontractorName = item[subcontractorNameHeader];
                                                                                  subcontractorCategory = item[subcontractorCategoryHeader];
                                                                                }
                                                                                totalPayForPeriod = totalPayForPeriod + item[payForShiftHeader];
                                                                                
                                                                              }
                                                                            })
                                    
                                    subcontractorEntry[subcontractorIDHeader] = subcontractorID;
                                    subcontractorEntry[subcontractorNameHeader] = subcontractorName;
                                    subcontractorEntry[subcontractorCategoryHeader] = subcontractorCategory;
                                    subcontractorEntry["Total Pay for Period"] = totalPayForPeriod;
                                    
                                    laborPaymentSummary.push(subcontractorEntry);
                                  })
  
  Logger.log(laborPaymentSummary);
  
}
