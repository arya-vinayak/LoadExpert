import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  children?: React.ReactNode;
}
const Breadcrumb = ({ pageName, children }: BreadcrumbProps) => {
  return (
    <div className="mb-6 mt-8 ml-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        {pageName}
      </h1>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Home /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
          <li>{children}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
