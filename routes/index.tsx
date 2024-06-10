import LinkForm from "../islands/LinkForm.tsx";
import LinksList from "../islands/LinksList.tsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-xl w-full space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Simple Link Shortener
        </h1>
        <p className="text-gray-500 md:text-xl dark:text-gray-400">
          Shorten your long URLs with our easy-to-use link shortener.
        </p>
        <LinkForm />
        <LinksList />
        <div className="flex items-center justify-center space-x-2">
          <p className="text-gray-500 dark:text-gray-400">Your short link:</p>
          <a
            href="#"
            className="font-medium text-gray-900 hover:underline dark:text-gray-50"
          >
            https://example.com/abc123
          </a>
        </div>
      </div>
    </div>
  );
}
