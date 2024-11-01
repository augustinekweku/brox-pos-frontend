import { ProductsTable } from "@/components/tables/ProductsTable/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <ProductsTable />
    </div>
  );
}
