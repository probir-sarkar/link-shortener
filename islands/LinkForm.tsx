import { links } from "./store.ts";

export interface Link {
  id: string;
  link: string;
}

const LinkForm = () => {
  async function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const longUrl = form.longUrl.value;
    if (!longUrl) return;
    const response = await fetch("/api/shortener", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: longUrl }),
    });
    if (response.ok) {
      const data: Link = await response.json();
      const values: Link[] = links.value;
      if (!values.some((link) => link.id === data.id)) {
        links.value = [...values, data];
      }
      form.reset();
    }
  }

  return (
    <form
      className="flex w-full max-w-md space-x-2 mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="url"
        name="longUrl"
        placeholder="Enter your long URL"
        className="flex-1  p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none "
        required
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 "
      >
        Shorten
      </button>
    </form>
  );
};

export default LinkForm;
