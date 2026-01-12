import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { api } from '@/core/api/api';

export interface GeneratePdfResponse {
  success: boolean;
  filePath: string;
}

export const generateInvoicePdf = async (
  id: string,
): Promise<GeneratePdfResponse> => {
  console.log('[PDF] Starting PDF generation for invoice:', id);
  console.log('[PDF] FileSystem module:', FileSystem);
  console.log('[PDF] cacheDirectory:', FileSystem.cacheDirectory);
  console.log('[PDF] documentDirectory:', FileSystem.documentDirectory);

  try {
    // Get the PDF as a blob
    console.log('[PDF] Requesting PDF from API...');
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    console.log('[PDF] API response received, status:', response.status);

    // Create file path - try cacheDirectory, fallback to documentDirectory
    const fileName = `invoice-${id}-${Date.now()}.pdf`;
    const baseDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;

    if (!baseDir) {
      throw new Error(
        'No storage directory available. FileSystem module may not be properly initialized.',
      );
    }

    const filePath = `${baseDir}${fileName}`;
    console.log('[PDF] File path:', filePath);

    // Check if response.data is a Blob
    const blob = response.data;
    console.log('[PDF] Blob size:', blob?.size, 'type:', blob?.type);

    if (!blob || blob.size === 0) {
      throw new Error('Empty PDF response from server');
    }

    // Convert blob to base64
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          console.log('[PDF] FileReader completed');
          const base64data = reader.result as string;

          // Remove the data URL prefix (data:application/pdf;base64,)
          const base64 = base64data.split(',')[1];
          console.log('[PDF] Base64 content length:', base64?.length);

          if (!base64) {
            throw new Error('Failed to convert PDF to base64');
          }

          // Write file to storage
          console.log('[PDF] Writing file...');
          console.log('[PDF] EncodingType:', FileSystem.EncodingType);

          await FileSystem.writeAsStringAsync(filePath, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log('[PDF] File written successfully');

          // Verify file exists
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          console.log('[PDF] File info:', JSON.stringify(fileInfo));

          // Share/open the file
          const sharingAvailable = await Sharing.isAvailableAsync();
          console.log('[PDF] Sharing available:', sharingAvailable);

          if (sharingAvailable) {
            console.log('[PDF] Opening share dialog...');
            await Sharing.shareAsync(filePath, {
              mimeType: 'application/pdf',
              dialogTitle: 'Invoice PDF',
            });
            console.log('[PDF] Share dialog closed');
          }

          resolve({ success: true, filePath });
        } catch (error) {
          console.error('[PDF] Error in FileReader callback:', error);
          reject(error);
        }
      };
      reader.onerror = (error) => {
        console.error('[PDF] FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error('[PDF] Error generating PDF:', error);
    console.error('[PDF] Error message:', error?.message);
    throw error;
  }
};
