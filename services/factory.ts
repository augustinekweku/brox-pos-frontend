export async function fetchData<T>({
  endpoint,
  method,
  payload,
  header,
  params,
}: {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payload?: Record<string, any>;
  header?: Record<string, any>;
  params?: Record<string, any>; // New param option
}): Promise<T> {
  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.NEXT_PUBLIC_POS_APP_KEY!,
      },
    };

    if (payload) {
      requestOptions.body = JSON.stringify(payload);
    }

    if (header) {
      requestOptions.headers = {
        ...requestOptions.headers,
        ...header,
      };
    }

    // Build URL with query params if provided
    let url = endpoint;
    if (params) {
      //remove undefined values
      Object.keys(params).forEach(
        (key) => params[key] === undefined && delete params[key]
      );
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    const res = await fetch(url, requestOptions);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`${error.message}`);
    }

    const data: T = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}
