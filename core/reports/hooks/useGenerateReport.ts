import { useMutation } from '@tanstack/react-query';
import {
  generateReportFile,
  GenerateReportPayload,
  GenerateReportResponse,
} from '../actions/generate-report-file.action';

/**
 * Hook to generate and download a PDF report.
 * Uses the new generateReportFile action that downloads, saves, and shares the PDF.
 *
 * @returns Mutation object with mutate, mutateAsync, isPending, isSuccess, isError, etc.
 */
export const useGenerateReport = () => {
  return useMutation<
    GenerateReportResponse,
    Error,
    GenerateReportPayload,
    unknown
  >({
    mutationFn: (payload: GenerateReportPayload) => generateReportFile(payload),
  });
};

export default useGenerateReport;
