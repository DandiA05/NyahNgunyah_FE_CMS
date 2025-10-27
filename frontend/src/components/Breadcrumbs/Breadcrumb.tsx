import Link from "next/link";

interface BreadcrumbPath {
  name: string;
  href?: string; // jika null/undefined maka bukan link
}

interface BreadcrumbProps {
  pageName: string;
  paths?: BreadcrumbPath[]; // optional, urutan breadcrumb
}

const Breadcrumb = ({ pageName, paths = [] }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {paths.map((path, index) => (
            <li key={index}>
              {path.href ? (
                <Link className="font-medium" href={path.href}>
                  {path.name} /
                </Link>
              ) : (
                <span className="font-medium">{path.name} /</span>
              )}
            </li>
          ))}
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
