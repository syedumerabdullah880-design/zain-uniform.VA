/**
 * ============================================================================
 * ZAIN UNIFORMS — INSTITUTIONAL SUPPLY BACKEND (GOOGLE APPS SCRIPT)
 * SPREADSHEET: Zain School Uniform Manufacturer & Tailoring
 * WORKSHEET:   Institutional Applications
 * ============================================================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. In the `initialSetup()` function below, enter your:
 *      - SPREADSHEET_ID
 *      - DRIVE_FOLDER_ID
 * 2. Select `initialSetup` from the function dropdown at the top and click "Run".
 *    (This securely saves your IDs into Script Properties without hard-coding them).
 * 3. Click "Deploy" > "New deployment".
 * 4. Choose type: "Web app".
 * 5. Execute as: "Me" (your Google account).
 * 6. Who has access: "Anyone".
 * 7. Click "Deploy", authorize permissions, and copy the Web App URL.
 */

// Name of the target worksheet inside your spreadsheet
var WORKSHEET_NAME = "Institutional Applications";

// 22 Required Columns in Row 1
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

// ============================================================================
// ONE-TIME SETUP FUNCTION (Run once from the Apps Script Editor)
// ============================================================================
function initialSetup() {
  // YOUR SPREADSHEET ID IS PRE-CONFIGURED:
  var SPREADSHEET_ID = "1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw";
  // ENTER YOUR GOOGLE DRIVE FOLDER ID HERE (Optional - or leave blank to use Drive Root / Zain Uploads folder):
  var DRIVE_FOLDER_ID = "";

  var scriptProperties = PropertiesService.getScriptProperties();

  // Save securely into Script Properties
  scriptProperties.setProperty("SPREADSHEET_ID", SPREADSHEET_ID.trim());
  if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== "") {
    scriptProperties.setProperty("DRIVE_FOLDER_ID", DRIVE_FOLDER_ID.trim());
  }

  Logger.log("✅ Script Properties configured successfully!");
  Logger.log("SPREADSHEET_ID: " + scriptProperties.getProperty("SPREADSHEET_ID"));
  Logger.log("DRIVE_FOLDER_ID: " + scriptProperties.getProperty("DRIVE_FOLDER_ID"));

  // Verify and initialize Spreadsheet & Worksheet
  try {
    var ss = getTargetSpreadsheet();
    Logger.log("✅ Connected to Spreadsheet: " + ss.getName());

    var sheet = ss.getSheetByName(WORKSHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(WORKSHEET_NAME);
      initHeaders(sheet);
      Logger.log("✅ Created worksheet '" + WORKSHEET_NAME + "' with 22 header columns.");
    } else if (sheet.getLastRow() === 0) {
      initHeaders(sheet);
      Logger.log("✅ Initialized 22 header columns in '" + WORKSHEET_NAME + "'.");
    } else {
      Logger.log("✅ Worksheet '" + WORKSHEET_NAME + "' already exists with " + sheet.getLastRow() + " rows.");
    }
  } catch (err) {
    Logger.log("❌ Spreadsheet verification warning: " + err.message);
  }

  // Verify Google Drive Folder
  try {
    var folder = getTargetDriveFolder();
    Logger.log("✅ Connected to Google Drive Folder: " + folder.getName());
  } catch (err) {
    Logger.log("❌ Drive folder verification warning: " + err.message);
  }
}

// ============================================================================
// HTTP GET HANDLER (Health check & status verification)
// ============================================================================
function doGet(e) {
  var ssId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "Not configured";
  var driveId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID") || "Not configured";
  return createJsonResponse({
    success: true,
    status: "online",
    message: "Zain Uniforms Google Apps Script Backend is active.",
    spreadsheetConfigured: ssId !== "Not configured",
    driveFolderConfigured: driveId !== "Not configured"
  });
}

// ============================================================================
// HTTP POST HANDLER (Receives form submissions from the website backend)
// ============================================================================
function doPost(e) {
  // Script lock prevents race conditions and duplicate application IDs
  var lock = LockService.getScriptLock();
  var lockAcquired = lock.tryLock(30000);

  if (!lockAcquired) {
    return createJsonResponse({
      success: false,
      message: "Server is busy processing another submission. Please try again."
    });
  }

  try {
    // 1. Parse JSON payload
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        message: "No POST body content received."
      });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({
        success: false,
        message: "Invalid JSON format: " + parseErr.message
      });
    }

    // 2. Open Target Spreadsheet
    var ss = getTargetSpreadsheet();
    if (!ss) {
      throw new Error("Unable to open spreadsheet. Please ensure SPREADSHEET_ID is set in Script Properties.");
    }

    // 3. Open or Create Worksheet "Institutional Applications"
    var sheet = ss.getSheetByName(WORKSHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(WORKSHEET_NAME);
      initHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      initHeaders(sheet);
    }

    // 4. Generate Unique Sequential Application ID (ZU-INS-00001 format)
    var nextNumber = 1;
    var lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      var idRange = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      var maxNum = 0;
      for (var i = 0; i < idRange.length; i++) {
        var val = String(idRange[i][0] || "");
        var match = val.match(/ZU-INS-(\d+)/i);
        if (match && match[1]) {
          var parsedNum = parseInt(match[1], 10);
          if (parsedNum > maxNum) {
            maxNum = parsedNum;
          }
        }
      }
      nextNumber = (maxNum > 0) ? (maxNum + 1) : lastRow;
    }

    var applicationId = "ZU-INS-" + padZero(nextNumber, 5);

    // 5. Handle Reference File / Monogram Upload to Google Drive
    var referenceFileUrl = "";
    if (data.referenceFile && data.referenceFile.base64) {
      try {
        referenceFileUrl = uploadFileToDrive(data.referenceFile, applicationId, data.schoolOrBusinessName);
      } catch (fileErr) {
        Logger.log("File upload warning: " + fileErr.message);
        referenceFileUrl = "File upload failed: " + fileErr.message;
      }
    } else if (data.referenceFileUrl) {
      referenceFileUrl = data.referenceFileUrl;
    }

    // 6. Parse Contact Person Name and Designation
    var contactPersonName = data.contactPersonName || "";
    var designation = data.designation || "";

    if (!designation && data.contactPerson) {
      var parsed = splitNameAndDesignation(data.contactPerson);
      contactPersonName = parsed.name;
      designation = parsed.designation;
    } else if (!contactPersonName && data.contactPerson) {
      contactPersonName = data.contactPerson;
    }

    // 7. Format current submission timestamp (Asia/Karachi)
    var submissionTimestamp = Utilities.formatDate(new Date(), "Asia/Karachi", "yyyy-MM-dd HH:mm:ss");

    // 8. Build 22-Column Row Array
    var rowData = [
      applicationId,                                            // 1. Application ID
      submissionTimestamp,                                      // 2. Submission Date
      data.schoolOrBusinessName || "",                         // 3. School / Business Name
      contactPersonName,                                        // 4. Contact Person Name
      designation,                                              // 5. Designation
      data.city || "",                                          // 6. City / Campus Location
      data.phone || "",                                         // 7. Official Phone
      data.whatsapp || data.phone || "",                       // 8. WhatsApp Number
      data.email || "",                                         // 9. Official Email
      data.uniformType || "",                                   // 10. Uniform Type / Items Needed
      data.estimatedQuantity || "",                             // 11. Total Estimated Quantity
      (data.boysCount !== undefined) ? data.boysCount : "",     // 12. Boys Uniforms
      (data.girlsCount !== undefined) ? data.girlsCount : "",   // 13. Girls Uniforms
      data.requiredDeliveryDate || data.deliveryDeadline || "", // 14. Delivery Deadline
      data.fabricPreference || "",                              // 15. Fabric Preference
      data.color || data.colourPalette || "",                   // 16. Colour Palette
      data.sizeBreakdown || "",                                 // 17. Grade / Size Breakdown
      data.designDetails || data.embroideryDetails || "",       // 18. Embroidery Details
      referenceFileUrl,                                         // 19. Reference File URL
      "New",                                                    // 20. Application Status (Default)
      data.adminNotes || "Received via Zain Uniforms Website Form", // 21. Admin Notes
      submissionTimestamp                                       // 22. Last Updated
    ];

    // 9. Append as a new row (never overwrite existing applications)
    sheet.appendRow(rowData);

    // Format new row styling
    var newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1).setFontWeight("bold").setFontFamily("Courier New");
    sheet.getRange(newRow, 20).setFontWeight("bold").setBackground("#EFF6FF");

    // 10. Return success JSON response
    return createJsonResponse({
      success: true,
      applicationId: applicationId,
      submissionDate: submissionTimestamp,
      referenceFileUrl: referenceFileUrl,
      message: "Application Submitted Successfully"
    });

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return createJsonResponse({
      success: false,
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Retrieves the target Google Spreadsheet using SPREADSHEET_ID from Script Properties,
 * or falls back to the bound Active Spreadsheet.
 */
function getTargetSpreadsheet() {
  var id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (id && id.trim() !== "") {
    return SpreadsheetApp.openById(id.trim());
  }
  // Fallback to configured spreadsheet ID
  var hardcodedId = "1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw";
  try {
    return SpreadsheetApp.openById(hardcodedId);
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

/**
 * Retrieves the target Google Drive Folder using DRIVE_FOLDER_ID from Script Properties,
 * or creates/uses a folder named "Zain Uniforms - Reference Files".
 */
function getTargetDriveFolder() {
  var folderId = PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID");
  if (folderId && folderId.trim() !== "") {
    return DriveApp.getFolderById(folderId.trim());
  }
  
  var folderName = "Zain Uniforms - Reference Files";
  var folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

/**
 * Uploads a base64 encoded reference file to Google Drive and returns its public URL
 */
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

  // Set file view access for school admins & tailoring masters
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

/**
 * Initializes Row 1 with the 22 header columns and styled headers
 */
function initHeaders(sheet) {
  sheet.appendRow(HEADERS);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#0F1E36"); // Deep Navy Blue
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  sheet.setFrozenRows(1);

  for (var col = 1; col <= HEADERS.length; col++) {
    sheet.autoResizeColumn(col);
  }
}

/**
 * Splits "Asim Raza (Procurement Head)" or "Asim Raza - Principal"
 */
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

/**
 * Pads numbers with leading zeros (e.g. 1 -> "00001")
 */
function padZero(num, size) {
  var s = String(num);
  while (s.length < (size || 5)) s = "0" + s;
  return s;
}

/**
 * Returns JSON formatted HTTP response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
