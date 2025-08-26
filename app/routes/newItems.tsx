import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { useState } from "react";
import { supabase } from "~/supabase-client";

export function meta() {
  return [
    { title: "New Item | RRV7 Crud" },
    {
      name: "description",
      content: "Create a new item using our Supabase CRUD app.",
    },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || !description) {
    return { error: "Title and content are required" };
  }

  const { error } = await supabase.from("items").insert({ title, description });

  if (error) {
    return { error: error.message };
  }

  return redirect("/");
}

export default function NewItem() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    e.currentTarget.submit();
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Item</h2>
      <Form method="post" className="space-y-4 bg-white p-4 rounded shadow" onSubmit={handleSubmit}>
        <div>
          <label className="block text-gray-700">Title</label>
          <input name="title" type="text" className="border border-gray-300 rounded px-3 py-2 w-full" required />
        </div>
        <div>
          <label className="block text-gray-700">Content</label>
          <textarea name="description" className="border border-gray-300 rounded px-3 py-2 w-full" required />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Create Item"}
        </button>
      </Form>
    </div>
  );
}
