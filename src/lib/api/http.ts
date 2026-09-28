export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function successResponse<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      throw new ApiError("Request body must contain valid JSON", 400);
    }

    throw error;
  }
}

export async function handleApiRequest(
  handler: () => Response | Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { success: false, error: error.message },
        { status: error.status },
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("Unexpected API error:", error);
    }

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
