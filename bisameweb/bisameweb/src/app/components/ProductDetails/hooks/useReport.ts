import useSWRMutation from 'swr/mutation';

interface ReportResponse {
  success?: boolean;
  error?: string;
  [key: string]: unknown;
}

interface ReportPayload {
  listingId: string;
  message: string;
}

async function sendReport(
  url: string,
  { arg }: { arg: ReportPayload }
): Promise<ReportResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
  
  const result = await res.json();
  if (!res.ok) {
    return { error: result.error || result.message || 'Failed to report seller.' };
  }
  return result;
}

export function useReport() {
  const { trigger, isMutating: loading, data, error } = useSWRMutation(
    '/api/ReportSeller',
    sendReport
  );

  const reportSeller = async (listingId: string, message: string) => {
    return await trigger({ listingId, message });
  };

  return {
    reportSeller,
    loading,
    error: error ? (error as Error).message : undefined,
    data,
  };
}