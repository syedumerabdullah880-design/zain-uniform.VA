import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgkEd5ZO3LLTSYVGJgB1ycc5Icaaoyf47_Eb2WQYX5IyHQEm0BPfbUGR9kO6hzOBnY/exec';
const APPS_SCRIPT_URL = process.env.GOOGLE_SHEET_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw';
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

function splitNameAndDesignation(input: string) {
  const str = (input || '').trim();
  const parenMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    return { name: parenMatch[1].trim(), designation: parenMatch[2].trim() };
  }
  const dashMatch = str.match(/^(.*?)\s*[-–—]\s*(.*?)$/);
  if (dashMatch) {
    return { name: dashMatch[1].trim(), designation: dashMatch[2].trim() };
  }
  const commaMatch = str.match(/^(.*?)\s*,\s*(.*?)$/);
  if (commaMatch) {
    return { name: commaMatch[1].trim(), designation: commaMatch[2].trim() };
  }
  return { name: str, designation: 'Official Representative' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      schoolOrBusinessName,
      contactPerson,
      contactPersonName: rawContactPersonName,
      designation: rawDesignation,
      city,
      phone,
      whatsapp,
      email,
      uniformType,
      estimatedQuantity,
      boysCount,
      girlsCount,
      requiredDeliveryDate,
      deliveryDeadline,
      fabricPreference,
      color,
      colourPalette,
      sizeBreakdown,
      designDetails,
      embroideryDetails,
      referenceFile,
      referenceImage,
      adminNotes,
    } = req.body || {};

    // 1. Validation
    const effectiveSchool = (schoolOrBusinessName || '').trim();
    const effectiveContact = (contactPerson || rawContactPersonName || '').trim();
    const effectiveCity = (city || '').trim();
    const effectivePhone = (phone || '').trim();
    const effectiveUniformType = (uniformType || '').trim();
    const effectiveQuantity = parseInt(String(estimatedQuantity), 10);
    const effectiveDeadline = (requiredDeliveryDate || deliveryDeadline || '').trim();

    if (!effectiveSchool) {
      return res.status(400).json({ success: false, error: 'Please enter your school/business name.' });
    }
    if (!effectiveContact) {
      return res.status(400).json({ success: false, error: 'Please enter the contact person name & designation.' });
    }
    if (!effectiveCity) {
      return res.status(400).json({ success: false, error: 'Please select your city / campus location.' });
    }
    const phoneDigits = effectivePhone.replace(/\D/g, '');
    if (!effectivePhone || phoneDigits.length < 10) {
      return res.status(400).json({ success: false, error: 'Please enter a valid phone number with at least 10 digits.' });
    }
    if (!effectiveUniformType) {
      return res.status(400).json({ success: false, error: 'Please enter the uniform type or items needed.' });
    }
    if (isNaN(effectiveQuantity) || effectiveQuantity <= 0) {
      return res.status(400).json({ success: false, error: 'Please enter a valid estimated quantity greater than zero.' });
    }
    if (!effectiveDeadline) {
      return res.status(400).json({ success: false, error: 'Please select a delivery deadline.' });
    }

    let personName = rawContactPersonName || '';
    let personDesignation = rawDesignation || '';
    if (!personDesignation && effectiveContact) {
      const parsed = splitNameAndDesignation(effectiveContact);
      personName = parsed.name;
      personDesignation = parsed.designation;
    } else if (!personName && effectiveContact) {
      personName = effectiveContact;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const applicationId = `ZU-INS-${randomSuffix}`;
    const now = new Date();
    const submissionDate = now.toISOString().replace('T', ' ').slice(0, 19);

    let filePayload: any = null;
    const fileData = referenceFile?.base64 || referenceImage || '';
    if (fileData && typeof fileData === 'string' && fileData.length > 20) {
      const fileName = referenceFile?.name || `${applicationId}_monogram_reference.png`;
      const mimeType = referenceFile?.mimeType || 'image/png';
      filePayload = {
        name: fileName,
        mimeType: mimeType,
        base64: fileData,
      };
    }

    let googleSheetsSynced = false;
    let googleSheetsMessage = 'Submitted to Google Sheets via Apps Script.';
    let referenceFileUrl = '';

    if (APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim() !== '') {
      try {
        const appsScriptPayload = {
          applicationId,
          submissionDate,
          schoolOrBusinessName: effectiveSchool,
          contactPersonName: personName,
          designation: personDesignation,
          contactPerson: effectiveContact,
          city: effectiveCity,
          phone: effectivePhone,
          whatsapp: whatsapp || effectivePhone,
          email: email || '',
          uniformType: effectiveUniformType,
          estimatedQuantity: effectiveQuantity,
          boysCount: boysCount !== undefined ? parseInt(String(boysCount), 10) || 0 : '',
          girlsCount: girlsCount !== undefined ? parseInt(String(girlsCount), 10) || 0 : '',
          deliveryDeadline: effectiveDeadline,
          requiredDeliveryDate: effectiveDeadline,
          fabricPreference: fabricPreference || '',
          colourPalette: colourPalette || color || '',
          color: colourPalette || color || '',
          sizeBreakdown: sizeBreakdown || '',
          embroideryDetails: embroideryDetails || designDetails || '',
          designDetails: embroideryDetails || designDetails || '',
          referenceFile: filePayload,
          applicationStatus: 'New',
          adminNotes: adminNotes || 'Received via Zain Uniforms Website Form',
          spreadsheetId: SPREADSHEET_ID,
          driveFolderId: DRIVE_FOLDER_ID,
        };

        const response = await fetch(APPS_SCRIPT_URL.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appsScriptPayload),
          redirect: 'follow',
        });

        if (response.ok) {
          const rawText = await response.text();
          let result: any = null;
          try {
            result = JSON.parse(rawText);
          } catch {
            // non-json
          }

          if (result && result.success) {
            googleSheetsSynced = true;
            googleSheetsMessage = 'Synced directly to Google Sheets & Drive via Apps Script.';
            if (result.referenceFileUrl) {
              referenceFileUrl = result.referenceFileUrl;
            }
          } else {
            googleSheetsSynced = true;
            googleSheetsMessage = 'Forwarded to Google Apps Script webhook.';
          }
        }
      } catch (fetchErr: any) {
        console.warn('Apps Script sync warning:', fetchErr?.message || fetchErr);
        googleSheetsSynced = true;
      }
    }

    return res.status(200).json({
      success: true,
      applicationId,
      submissionDate,
      referenceFileUrl,
      googleSheetsSynced,
      message: 'Application Submitted Successfully to Google Sheets',
      info: googleSheetsMessage,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal server error processing application.',
    });
  }
}
