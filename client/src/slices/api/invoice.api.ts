import { emptySplitApi } from "./emptySplitApi";
const BASE_URL = "/revenue/invoice";

export const invoiceApiSlice = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    //? GENERATE Invoice PDF
    generateInvoice: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}`,
        method: "POST",
        body: data, // Send the transformed data as body
      }),
    }),

    //? DOWNLOAD Invoice PDF
    downloadInvoice: builder.query({
      query: () => ({
        url: `${BASE_URL}/invoice.pdf`,
        method: "GET",
        responseType: 'blob',
      }),
    }),
  }),
});

export const {
  useGenerateInvoiceMutation,
  useLazyDownloadInvoiceQuery,
} = invoiceApiSlice;
