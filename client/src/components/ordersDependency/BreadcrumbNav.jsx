import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useParams, useLocation } from "react-router-dom";

const BreadcrumbNav = () => {
  const { branchSlug } = useParams();
  const location = useLocation();

  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumbs aria-label="breadcrumb" className="mb-4">
      <Link component={RouterLink} to="/" color="inherit">
        Home
      </Link>
      {paths.map((path, index) => {
        const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;

        return isLast ? (
          <Typography key={path} color="text.primary">
            {decodeURIComponent(path.replace(/-/g, " "))}
          </Typography>
        ) : (
          <Link key={path} component={RouterLink} to={routeTo} color="inherit">
            {decodeURIComponent(path.replace(/-/g, " "))}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
