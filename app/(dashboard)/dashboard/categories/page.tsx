import { CategoriesTable } from "@/components/tables/CategoriesTable/CategoriesTable";

export default function CategoriesPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <CategoriesTable />
    </main>
  );
}
