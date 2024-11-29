import { User } from "@clerk/nextjs/server";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery, } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOption: any,
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers;
    }
  })

  try {
    const result: any = await baseQuery(args, api, extraOption);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || errorData?.error.status.toString() || "An error occured"
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== "GET"
    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) {
        toast.success(successMessage);
      }
    }

    if (result.data) {
      result.data = result.data.data;
      return result;
    }


    if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    // Return an error if no valid data or error is found
    return {
      error: {
        status: "NO_CONTENT",
        message: "No valid data or error returned from the server.",
      },
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    return {
      error: {
        status: "FETCH_ERROR",
        error: errorMessage,
      }
    }
  }
}

export const api = createApi({
  baseQuery: customBaseQuery,
  tagTypes: ["Courses", "Users"],
  reducerPath: "api",
  endpoints: (build) => ({


    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser
      }),
      invalidatesTags: ["Users"]
    }),
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({ url: "courses", params: { category } }),
      providesTags: ["Courses"]
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }]
    }),
    createStripePaymentIntent: build.mutation<{ clientSecret: string }, { amount: number }>({
      query: ({ amount }) => ({
        url: `/transaction/stripe/payment-intent`,
        method: "POST",
        body: { amount }
      }),
      invalidatesTags: ["Users"]
    }),
  })
})


export const {
  useUpdateUserMutation, useGetCoursesQuery, useGetCourseQuery, useCreateStripePaymentIntentMutation
} = api;