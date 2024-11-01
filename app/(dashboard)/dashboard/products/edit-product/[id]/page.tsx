"use client";

import { useParams } from "next/navigation";
import SingleProduct from "../../SingleProduct";

export default function ProductDetailsPage() {
  const params = useParams();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <SingleProduct id={params.id as string} isEditing={true} />
    </main>
  );
}
