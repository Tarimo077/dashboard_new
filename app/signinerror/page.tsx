import { useSearchParams } from 'next/navigation';

interface ErrorPageProps {
  searchParams: {
    error?: string;
  };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const errorMessage = searchParams.error || "An unknown error occurred.";

  return (
    <div>
      <h1>Error</h1>
      <p>{errorMessage}</p>
      <a href="/">Go back to Sign In</a>
    </div>
  );
}
