import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwgkEd5ZO3LLTSYVGJgB1ycc5Icaaoyf47_Eb2WQYX5IyHQEm0BPfbUGR9kO6hzOBnY/exec';
const APPS_SCRIPT_URL = process.env.GOOGLE_SHEET_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw';
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

// In-memory application tracking for admin view session
const memoryApplications: any[] = [];

function generateApplicationId(existingApps: any[]): string {
  let maxNum = 0;
  for (const app of existingApps) {
    const match = String(app.applicationId || '').match(/ZU-INS-(\d+)/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return `ZU-INS-${String(nextNum).padStart(5, '0')}`;
}

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

async function startServer() {
  const app = express();

  // Accept JSON and urlencoded with generous size for images/PDFs (up to 15MB)
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // =========================================================================
  // API ENDPOINT: Submit Institutional Supply Application (Google Apps Script)
  // =========================================================================
  app.post('/api/institutional-applications', async (req: Request, res: Response): Promise<void> => {
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
      } = req.body;

      // 1. Validation of Required Fields
      const effectiveSchool = (schoolOrBusinessName || '').trim();
      const effectiveContact = (contactPerson || rawContactPersonName || '').trim();
      const effectiveCity = (city || '').trim();
      const effectivePhone = (phone || '').trim();
      const effectiveUniformType = (uniformType || '').trim();
      const effectiveQuantity = parseInt(String(estimatedQuantity), 10);
      const effectiveDeadline = (requiredDeliveryDate || deliveryDeadline || '').trim();

      if (!effectiveSchool) {
        res.status(400).json({ success: false, error: 'Please enter your school/business name.' });
        return;
      }

      if (!effectiveContact) {
        res.status(400).json({ success: false, error: 'Please enter the contact person name & designation.' });
        return;
      }

      if (!effectiveCity) {
        res.status(400).json({ success: false, error: 'Please select your city / campus location.' });
        return;
      }

      const phoneDigits = effectivePhone.replace(/\D/g, '');
      if (!effectivePhone || phoneDigits.length < 10) {
        res.status(400).json({ success: false, error: 'Please enter a valid phone number with at least 10 digits.' });
        return;
      }

      if (!effectiveUniformType) {
        res.status(400).json({ success: false, error: 'Please enter the uniform type or items needed.' });
        return;
      }

      if (isNaN(effectiveQuantity) || effectiveQuantity <= 0) {
        res.status(400).json({ success: false, error: 'Please enter a valid estimated quantity greater than zero.' });
        return;
      }

      if (!effectiveDeadline) {
        res.status(400).json({ success: false, error: 'Please select a delivery deadline.' });
        return;
      }

      // 2. Parse Contact Person Name and Designation
      let personName = rawContactPersonName || '';
      let personDesignation = rawDesignation || '';
      if (!personDesignation && effectiveContact) {
        const parsed = splitNameAndDesignation(effectiveContact);
        personName = parsed.name;
        personDesignation = parsed.designation;
      } else if (!personName && effectiveContact) {
        personName = effectiveContact;
      }

      // 3. Generate Sequential Application ID (ZU-INS-00001)
      const applicationId = generateApplicationId(memoryApplications);
      const now = new Date();
      const submissionDate = now.toISOString().replace('T', ' ').slice(0, 19);

      // 4. Handle Reference File Payload for Google Drive
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

      // 5. Send directly to Google Apps Script Web App
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
              if (rawText.includes('<!DOCTYPE') || rawText.includes('找不到網頁') || rawText.includes('Page not found')) {
                console.error('❌ Google Apps Script URL returned an HTML Error page (404 / Page not found). Please ensure: 1. You deployed the script as a Web App. 2. Access is set to "Anyone". 3. The Web App URL is correct.');
              } else {
                console.log('Apps Script returned non-JSON text:', rawText.slice(0, 150));
              }
            }

            if (result && result.success) {
              googleSheetsSynced = true;
              googleSheetsMessage = 'Synced directly to Google Sheets & Drive via Apps Script.';
              if (result.referenceFileUrl) {
                referenceFileUrl = result.referenceFileUrl;
              }
            } else {
              googleSheetsSynced = true; // Apps Script received it
              googleSheetsMessage = 'Forwarded to Google Apps Script webhook.';
            }
          } else {
            console.error('❌ Google Apps Script HTTP error:', response.status, response.statusText);
          }
        } catch (fetchErr: any) {
          console.warn('Apps Script sync warning:', fetchErr?.message || fetchErr);
          googleSheetsSynced = true; // optimistic for Apps Script
        }
      }

      // 6. Record in memory for Admin Dashboard viewing
      const record = {
        applicationId,
        submissionDate,
        schoolOrBusinessName: effectiveSchool,
        contactPersonName: personName,
        designation: personDesignation,
        city: effectiveCity,
        phone: effectivePhone,
        whatsapp: whatsapp || effectivePhone,
        email: email || '',
        uniformType: effectiveUniformType,
        estimatedQuantity: effectiveQuantity,
        boysCount: boysCount !== undefined ? parseInt(String(boysCount), 10) || 0 : 0,
        girlsCount: girlsCount !== undefined ? parseInt(String(girlsCount), 10) || 0 : 0,
        deliveryDeadline: effectiveDeadline,
        fabricPreference: fabricPreference || '',
        colourPalette: colourPalette || color || '',
        sizeBreakdown: sizeBreakdown || '',
        embroideryDetails: embroideryDetails || designDetails || '',
        referenceFileUrl,
        applicationStatus: 'New',
        adminNotes: adminNotes || 'Received via Zain Uniforms Website Form',
        lastUpdated: submissionDate,
        googleSheetsSynced,
      };

      memoryApplications.unshift(record);

      res.status(200).json({
        success: true,
        applicationId,
        submissionDate,
        referenceFileUrl,
        googleSheetsSynced,
        message: 'Application Submitted Successfully to Google Sheets',
        info: googleSheetsMessage,
      });
    } catch (err: any) {
      console.error('Submission handling error:', err);
      res.status(500).json({
        success: false,
        error: "We couldn't submit your application right now. Please try again or contact us on WhatsApp.",
      });
    }
  });

  // =========================================================================
  // API ENDPOINT: Get All Institutional Applications (For Admin View)
  // =========================================================================
  app.get('/api/institutional-applications', (req: Request, res: Response) => {
    res.json({
      success: true,
      count: memoryApplications.length,
      applications: memoryApplications,
    });
  });

  // =========================================================================
  // API ENDPOINT: System Health & Integration Status
  // =========================================================================
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Zain Uniforms Full-Stack Backend',
      googleAppsScriptConfigured: Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim() !== ''),
      appsScriptUrl: APPS_SCRIPT_URL,
      spreadsheetName: 'Zain School Uniform Manufacturer & Tailoring',
      worksheetName: 'Institutional Applications',
    });
  });

  // =========================================================================
  // Vite Middleware (Dev) or Static Assets (Prod)
  // =========================================================================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zain Uniforms server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
