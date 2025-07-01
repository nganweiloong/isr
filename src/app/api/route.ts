import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  // Extract the path you want to invalidate from query parameters, for example
  const { searchParams } = new URL(request.url);
  const pathToRevalidate = searchParams.get("path");

  if (!pathToRevalidate) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 },
    );
  }

  try {
    // This invalidates/revalidates the path cache
    revalidatePath(pathToRevalidate);

    return NextResponse.json({
      message: `Revalidated path: ${pathToRevalidate}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
