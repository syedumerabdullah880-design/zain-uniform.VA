/**
 * ============================================================================
 * ZAIN UNIFORMS — INSTITUTIONAL SUPPLY BACKEND (GOOGLE APPS SCRIPT)
 * SPREADSHEET: Zain School Uniform Manufacturer & Tailoring
 * WORKSHEET:   Institutional Applications
 * ============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Enter your SPREADSHEET_ID and DRIVE_FOLDER_ID in initialSetup() or Script Properties.
 * 2. Run `initialSetup` once from the Apps Script Editor to set headers and properties.
 * 3. Deploy as Web App (Execute as: Me, Who has access: Anyone).
 */

var WORKSHEET_NAME = "Institutional Applications";

var HEADERS = [
  "Application ID",
  "Submission Date",
  "School / Business Name",
  "Contact Person Name",
  "Designation",
  "City / Campus Location",
  "Official Phone",
  "WhatsApp Number",
  "Official Email",
  "Uniform Type / Items Needed",
  "Total Estimated Quantity",
  "Boys Uniforms",
  "Girls Uniforms",
  "Delivery Deadline",
  "Fabric Preference",
  "Colour Palette",
  "Grade / Size Breakdown",
  "Embroidery Details",
  "Reference File URL",
  "Application Status",
  "Admin Notes",
  "Last Updated"
];

function initialSetup() {
  var SPREADSHEET_ID = "1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw";
  var DRIVE_FOLDER_ID = "";

  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("SPREADSHEET_ID", SPREADSHEET_ID.trim());
  if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== "") {
    scriptProperties.setProperty("DRIVE_FOLDER_ID", DRIVE_FOLDER_ID.trim());
  }

  Logger.log("✅ Script Properties configured successfully!");

  try {
    var ss = getTargetSpreadsheet();
    Logger.log("✅ Connected to Spreadsheet: " + ss.getName());

    var sheet = ss.getSheetByName(WORKSHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(WORKSHEET_NAME);
      initHeaders(sheet);
      Logger.log("✅ Created worksheet '" + WORKSHEET_NAME + "' with headers.");
    } else {
      ensureHeaders(sheet);
      Logger.log("✅ Verified worksheet and dynamic headers in '" + WORKSHEET_NAME + "'.");
    }
  } catch (err) {
    Logger.log("❌ Setup warning: " + err.message);
  }
}

function doGet(e) {
  var ssId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "Not configured";
  return createJsonResponse({
    success: true,
    status: "online",
    message: "Zain Uniforms Google Apps Script Backend is active with Dynamic Column Mapping.",
    spreadsheetConfigured: ssId !== "Not configured"
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    return createJsonResponse({
      success: false,
      message: "Server is busy processing another submission. Please try again."
    });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, message: "No POST body content received." });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({ success: false, message: "Invalid JSON format: " + parseErr.message });
    }

    var ss = getTargetSpreadsheet();
    if (!ss) throw new Error("Unable to open spreadsheet.");

    var sheet = ss.getSheetByName(WORKSHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(WORKSHEET_NAME);
      initHeaders(sheet);
    } else {
      ensureHeaders(sheet);
    }

    // Generate Unique Sequential Application ID
    var lastRow = sheet.getLastRow();
    var nextNumber = 1;
    var idColIndex = getColumnIndexByHeader(sheet, "Application ID");

    if (lastRow > 1 && idColIndex > 0) {
      var idRange = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
      var maxNum = 0;
      for (var i = 0; i < idRange.length; i++) {
        var val = String(idRange[i][0] || "");
        var match = val.match(/ZU-INS-(\d+)/i);
        if (match && match[1]) {
          var parsedNum = parseInt(match[1], 10);
          if (parsedNum > maxNum) maxNum = parsedNum;
        }
      }
      nextNumber = (maxNum > 0) ? (maxNum + 1) : lastRow;
    }

    var applicationId = "ZU-INS-" + padZero(nextNumber, 5);
    var submissionTimestamp = Utilities.formatDate(new Date(), "Asia/Karachi", "yyyy-MM-dd HH:mm:ss");

    // Handle File Upload to Drive
    var referenceFileUrl = "";
    if (data.referenceFile && data.referenceFile.base64) {
      try {
        referenceFileUrl = uploadFileToDrive(data.referenceFile, applicationId, data.schoolOrBusinessName);
      } catch (fileErr) {
        referenceFileUrl = "Upload failed: " + fileErr.message;
      }
    } else if (data.referenceFileUrl) {
      referenceFileUrl = data.referenceFileUrl;
    }

    var contactPersonName = data.contactPersonName || "";
    var designation = data.designation || "";
    if (!designation && data.contactPerson) {
      var parsed = splitNameAndDesignation(data.contactPerson);
      contactPersonName = parsed.name;
      designation = parsed.designation;
    } else if (!contactPersonName && data.contactPerson) {
      contactPersonName = data.contactPerson;
    }

    // Prepare mapping of values for dynamic columns
    var fieldValues = {
      "Application ID": applicationId,
      "Submission Date": submissionTimestamp,
      "School / Business Name": data.schoolOrBusinessName || "",
      "Contact Person Name": contactPersonName,
      "Designation": designation,
      "City / Campus Location": data.city || "",
      "Official Phone": data.phone || "",
      "WhatsApp Number": data.whatsapp || data.phone || "",
      "Official Email": data.email || "",
      "Uniform Type / Items Needed": data.uniformType || "",
      "Total Estimated Quantity": data.estimatedQuantity || "",
      "Boys Uniforms": (data.boysCount !== undefined) ? data.boysCount : "",
      "Girls Uniforms": (data.girlsCount !== undefined) ? data.girlsCount : "",
      "Delivery Deadline": data.requiredDeliveryDate || data.deliveryDeadline || "",
      "Fabric Preference": data.fabricPreference || "",
      "Colour Palette": data.color || data.colourPalette || "",
      "Grade / Size Breakdown": data.sizeBreakdown || "",
      "Embroidery Details": data.designDetails || data.embroideryDetails || "",
      "Reference File URL": referenceFileUrl,
      "Application Status": "New",
      "Admin Notes": data.adminNotes || "Received via Zain Uniforms Website Form",
      "Last Updated": submissionTimestamp
    };

    // Dynamically write row based on current header column positions in Row 1
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var newRowValues = [];
    for (var c = 0; c < headers.length; c++) {
      var headerName = String(headers[c]).trim();
      newRowValues.push(fieldValues.hasOwnProperty(headerName) ? fieldValues[headerName] : "");
    }

    sheet.appendRow(newRowValues);
    var insertedRow = sheet.getLastRow();

    // Style the newly inserted row
    var appIdCol = getColumnIndexByHeader(sheet, "Application ID");
    var statusCol = getColumnIndexByHeader(sheet, "Application Status");
    if (appIdCol > 0) sheet.getRange(insertedRow, appIdCol).setFontWeight("bold").setFontFamily("Courier New");
    if (statusCol > 0) sheet.getRange(insertedRow, statusCol).setFontWeight("bold").setBackground("#EFF6FF");

    return createJsonResponse({
      success: true,
      applicationId: applicationId,
      submissionDate: submissionTimestamp,
      referenceFileUrl: referenceFileUrl,
      message: "Application Submitted Successfully with Dynamic Column Mapping"
    });

  } catch (error) {
    return createJsonResponse({ success: false, message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function getTargetSpreadsheet() {
  var id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (id && id.trim() !== "") {
    return SpreadsheetApp.openById(id.trim());
  }
  return SpreadsheetApp.openById("1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw");
}

function getTargetDriveFolder() {
  var folderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
  if (folderId && folderId.trim() !== "") {
    return DriveApp.getFolderById(folderId.trim());
  }
  var folderName = "Zain Uniforms - Reference Files";
  var folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function uploadFileToDrive(fileObj, applicationId, schoolName) {
  var folder = getTargetDriveFolder();
  var base64Data = fileObj.base64;
  if (base64Data.indexOf(",") > -1) {
    base64Data = base64Data.split(",")[1];
  }
  var decodedBytes = Utilities.base64Decode(base64Data);
  var safeSchool = (schoolName || "Institutional").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  var fileName = applicationId + "_" + safeSchool + "_" + (fileObj.name || "monogram_spec");
  var mimeType = fileObj.mimeType || "application/octet-stream";
  var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function initHeaders(sheet) {
  sheet.clear();
  sheet.appendRow(HEADERS);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#0F1E36");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setFrozenRows(1);
  for (var col = 1; col <= HEADERS.length; col++) {
    sheet.autoResizeColumn(col);
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    initHeaders(sheet);
    return;
  }
  var currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var missing = [];
  for (var i = 0; i < HEADERS.length; i++) {
    var found = false;
    for (var j = 0; j < currentHeaders.length; j++) {
      if (String(currentHeaders[j]).trim().toLowerCase() === HEADERS[i].toLowerCase()) {
        found = true;
        break;
      }
    }
    if (!found) missing.push(HEADERS[i]);
  }
  if (missing.length > 0) {
    var nextCol = sheet.getLastColumn() + 1;
    for (var m = 0; m < missing.length; m++) {
      sheet.getRange(1, nextCol + m).setValue(missing[m]).setFontWeight("bold").setBackground("#0F1E36").setFontColor("#FFFFFF");
    }
  }
}

function getColumnIndexByHeader(sheet, headerName) {
  if (sheet.getLastRow() === 0) return -1;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (String(headers[i]).trim().toLowerCase() === headerName.toLowerCase()) {
      return i + 1; // 1-based index
    }
  }
  return -1;
}

function splitNameAndDesignation(input) {
  var str = (input || "").trim();
  var parenMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) return { name: parenMatch[1].trim(), designation: parenMatch[2].trim() };
  var dashMatch = str.match(/^(.*?)\s*[-–—]\s*(.*?)$/);
  if (dashMatch) return { name: dashMatch[1].trim(), designation: dashMatch[2].trim() };
  var commaMatch = str.match(/^(.*?)\s*,\s*(.*?)$/);
  if (commaMatch) return { name: commaMatch[1].trim(), designation: commaMatch[2].trim() };
  return { name: str, designation: "Official Representative" };
}

function padZero(num, size) {
  var s = String(num);
  while (s.length < (size || 5)) s = "0" + s;
  return s;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
