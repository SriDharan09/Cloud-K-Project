import { Breadcrumb } from "antd";
import { HomeOutlined, RightOutlined } from "@ant-design/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";

const BreadcrumbNav = () => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb
      separator={<RightOutlined />}
      className="mb-4 text-lg rounded-lg bg-white py-4!"

    >
      {/* Home Link */}
      <Breadcrumb.Item>
        <RouterLink to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
          <HomeOutlined /> <span>Home</span>
        </RouterLink>
      </Breadcrumb.Item>

      {/* Dynamic Paths */}
      {paths.map((path, index) => {
        const routeTo = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const formattedPath = decodeURIComponent(path.replace(/-/g, " "));

        return isLast ? (
          <Breadcrumb.Item key={path} className="text-gray-500 font-semibold">
            {formattedPath}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={path}>
            <RouterLink to={routeTo} className="text-gray-700 hover:text-blue-500">
              {formattedPath}
            </RouterLink>
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
