import { env } from "@/config/env";

export async function networkRequest(
  method: string = "GET",
  url: string,
  body: any = null,
  headers = {},
  queryParams: Record<string, any> = {},
  urlParams: Record<string, string> = {}
) {
  try {
    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.X_API_KEY,
        ...headers,
      },
    };

    if (urlParams && Object.keys(urlParams).length > 0) {
      Object.keys(urlParams).forEach((key) => {
        url = url.replace(`:${key}`, encodeURIComponent(urlParams[key]));
      });
    }

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    if (body && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `HTTP network request error! message: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
