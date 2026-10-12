import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DEFAULT_SHEETDB_URL = 'https://sheetdb.io/api/v1/pvwapuh88f4iq';
const SHEETDB_URL = process.env.SHEETDB_API_URL || DEFAULT_SHEETDB_URL;
const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0-womBk0G0q0XtKA8zgA8Sf_DN9nopvM0bhrcSUXaB2ZX4gLffZH7bwzNnl66yMsq/exec';
const APPS_SCRIPT_URL = process.env.GOOGLE_SHEET_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1P0ig9BSpBNH1FA23FUZSZZkCzR7WgJ16gFwEDk6ldkw';
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const APPS_SCRIPT_DEPLOYMENT_ID = process.env.GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID || 'AKfycby0-womBk0G0q0XtKA8zgA8Sf_DN9nopvM0bhrcSUXaB2ZX4gLffZH7bwzNnl66yMsq';

// Local data storage directory for persistence and offline backup
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'institutional_applications.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize local database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function getStoredApplications(): any[] {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredApplications(apps: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(apps, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to local database:', err);
  }
}

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
  // Parenthesis: "Asim Raza (Procurement Head)"
  const parenMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    return { name: parenMatch[1].trim(), designation: parenMatch[2].trim() };
  }
  // Dash: "Asim Raza - Principal"
  const dashMatch = str.match(/^(.*?)\s*[-–—]\s*(.*?)$/);
  if (dashMatch) {
    return { name: dashMatch[1].trim(), designation: dashMatch[2].trim() };
  }
  // Comma: "Asim Raza, Admin Officer"
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

  // Serve local uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // =========================================================================
  // API ENDPOINT: Submit Institutional Supply Application
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
        res.status(400).json({
          success: false,
          error: 'Please enter your school/business name.',
        });
        return;
      }

      if (!effectiveContact) {
        res.status(400).json({
          success: false,
          error: 'Please enter the contact person name & designation.',
        });
        return;
      }

      if (!effectiveCity) {
        res.status(400).json({
          success: false,
          error: 'Please select your city / campus location.',
        });
        return;
      }

      const phoneDigits = effectivePhone.replace(/\D/g, '');
      if (!effectivePhone || phoneDigits.length < 10) {
        res.status(400).json({
          success: false,
          error: 'Please enter a valid phone number with at least 10 digits.',
        });
        return;
      }

      if (!effectiveUniformType) {
        res.status(400).json({
          success: false,
          error: 'Please enter the uniform type or items needed.',
        });
        return;
      }

      if (isNaN(effectiveQuantity) || effectiveQuantity <= 0) {
        res.status(400).json({
          success: false,
          error: 'Please enter a valid estimated quantity greater than zero.',
        });
        return;
      }

      if (!effectiveDeadline) {
        res.status(400).json({
          success: false,
          error: 'Please select a delivery deadline.',
        });
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
      const existingApps = getStoredApplications();
      const applicationId = generateApplicationId(existingApps);

      const now = new Date();
      const submissionDate = now.toISOString().replace('T', ' ').slice(0, 19);

      // 4. Handle Reference File Upload (Local Backup & Google Drive payload)
      let referenceFileUrl = '';
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

        // Save local backup file in uploads directory
        try {
          const rawBase64 = fileData.includes(',') ? fileData.split(',')[1] : fileData;
          const buffer = Buffer.from(rawBase64, 'base64');
          const localFileName = `${applicationId}_${Date.now()}_${path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const localFilePath = path.join(UPLOADS_DIR, localFileName);
          fs.writeFileSync(localFilePath, buffer);
          referenceFileUrl = `/uploads/${localFileName}`;
        } catch (saveErr) {
          console.warn('Local file storage warning:', saveErr);
        }
      }

      // 5. Google Sheets Integration via SheetDB API and Apps Script
      let googleSheetsSynced = false;
      let googleSheetsMessage = 'Local database recorded.';

      // Format institution + contact person representation
      const contactDisplay = personName && personName.trim() !== ''
        ? (personName.trim() !== effectiveSchool ? `${effectiveSchool} (${personName.trim()})` : effectiveSchool)
        : (effectiveContact !== effectiveSchool ? `${effectiveSchool} (${effectiveContact})` : effectiveSchool);

      // --- PRIMARY PIPELINE: SheetDB API Direct Sync ---
      if (SHEETDB_URL && SHEETDB_URL.trim() !== '') {
        try {
          const contactPersonAndDesignation = personName
            ? (personDesignation ? `${personName} (${personDesignation})` : personName)
            : effectiveContact;

          // The payload keys matching the Google Sheet columns connected via SheetDB
          // Providing both exact headers with sheet-detected spacing and clean variants
          const sheetDbRow: Record<string, any> = {
            // 1. School / Business Name
            'School / Business Name   ': effectiveSchool,
            'School / Business Name': effectiveSchool,

            // 2. Contact Person Name & Designation
            'Contact Person Name & Designation   ': contactPersonAndDesignation,
            'Contact Person Name & Designation': contactPersonAndDesignation,

            // 3. City / Campus Location
            'City / Campus Location   ': effectiveCity,
            'City / Campus Location': effectiveCity,

            // 4. Official Mobile / Phone
            'Official Mobile / Phone   ': effectivePhone,
            'Official Mobile / Phone': effectivePhone,
            'phone number': effectivePhone,

            // 5. WhatsApp Number
            'WhatsApp Number   ': whatsapp || effectivePhone,
            'WhatsApp Number': whatsapp || effectivePhone,

            // 6. Official Email Address
            'Official Email Address   ': email || '',
            'Official Email Address': email || '',
            'Email ': email || '',
            'Email': email || '',

            // 7. Uniform Type / Items Needed
            'Uniform Type / Items Needed   ': effectiveUniformType,
            'Uniform Type / Items Needed': effectiveUniformType,
            'product': effectiveUniformType,

            // 8. Total Estimated Quantity
            'Total Estimated Quantity   ': String(effectiveQuantity),
            'Total Estimated Quantity': String(effectiveQuantity),
            'amount ': String(effectiveQuantity),
            'amount': String(effectiveQuantity),

            // 9. Boys Uniforms (Est.)
            'Boys Uniforms (Est.)   ': boysCount !== undefined && boysCount !== '' ? String(boysCount) : '0',
            'Boys Uniforms (Est.)': boysCount !== undefined && boysCount !== '' ? String(boysCount) : '0',
            'Boys Uniforms': boysCount !== undefined && boysCount !== '' ? String(boysCount) : '0',

            // 10. Girls Uniforms (Est.)
            'Girls Uniforms (Est.)   ': girlsCount !== undefined && girlsCount !== '' ? String(girlsCount) : '0',
            'Girls Uniforms (Est.)': girlsCount !== undefined && girlsCount !== '' ? String(girlsCount) : '0',
            'Girls Uniforms': girlsCount !== undefined && girlsCount !== '' ? String(girlsCount) : '0',

            // 11. Delivery Deadline
            'Delivery Deadline   ': effectiveDeadline,
            'Delivery Deadline': effectiveDeadline,
            'delivery date': effectiveDeadline,

            // 12. Fabric Preference
            'Fabric Preference   ': fabricPreference || '',
            'Fabric Preference': fabricPreference || '',

            // 13. Colour Palette
            'Colour Palette   ': colourPalette || color || '',
            'Colour Palette': colourPalette || color || '',

            // 14. Grade / Size Breakdown Notes
            'Grade / Size Breakdown Notes   ': sizeBreakdown || '',
            'Grade / Size Breakdown Notes': sizeBreakdown || '',

            // 15. School Crest / Monogram Embroidery Details
            'School Crest / Monogram Embroidery Details   ': embroideryDetails || designDetails || '',
            'School Crest / Monogram Embroidery Details': embroideryDetails || designDetails || '',

            // System references & file attachments
            'Application ID   ': applicationId,
            'Application ID': applicationId,
            'Submission Date   ': submissionDate,
            'Submission Date': submissionDate,
            'Reference File URL   ': referenceFileUrl || '',
            'Reference File URL': referenceFileUrl || '',
            'Application Status': 'New',
          };

          const sheetDbPayload = {
            data: [sheetDbRow],
          };

          const sheetDbResponse = await fetch(SHEETDB_URL.trim(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(sheetDbPayload),
          });

          if (sheetDbResponse.ok) {
            const dbResult: any = await sheetDbResponse.json();
            if (dbResult && (dbResult.created || dbResult.success)) {
              googleSheetsSynced = true;
              googleSheetsMessage = 'Synced directly to Google Sheets via SheetDB API.';
              console.log(`[SheetDB] Form submission saved to Google Sheet for ${applicationId}`);
            }
          } else {
            console.warn(`[SheetDB] HTTP ${sheetDbResponse.status}: ${sheetDbResponse.statusText}`);
          }
        } catch (sheetDbErr: any) {
          console.warn('[SheetDB] Sync error:', sheetDbErr?.message || sheetDbErr);
        }
      }

      // --- SECONDARY PIPELINE: Google Apps Script Web App (if configured) ---
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
            referenceFileUrl: referenceFileUrl,
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
              // Not JSON
            }

            if (result && result.success) {
              googleSheetsSynced = true;
              googleSheetsMessage = 'Synced directly to Google Sheets & Drive.';
              if (result.referenceFileUrl) {
                referenceFileUrl = result.referenceFileUrl;
              }
            }
          }
        } catch (fetchErr: any) {
          // Non-blocking
        }
      }

      // 6. Record Application Record in Persistent Database
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

      existingApps.unshift(record);
      saveStoredApplications(existingApps);

      res.status(200).json({
        success: true,
        applicationId,
        submissionDate,
        referenceFileUrl,
        googleSheetsSynced,
        message: 'Application Submitted Successfully',
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
    const apps = getStoredApplications();
    res.json({
      success: true,
      count: apps.length,
      applications: apps,
    });
  });

  // =========================================================================
  // API ENDPOINT: System Health & Integration Status
  // =========================================================================
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Zain Uniforms Full-Stack Backend',
      sheetDbConfigured: Boolean(SHEETDB_URL && SHEETDB_URL.trim() !== ''),
      sheetDbUrl: SHEETDB_URL,
      googleSheetsConfigured: Boolean((SHEETDB_URL && SHEETDB_URL.trim() !== '') || (APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim() !== '')),
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
