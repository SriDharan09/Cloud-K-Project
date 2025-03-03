import { useNavigate } from "react-router-dom";
import { Card, Rate, Tag } from "antd";

const BranchCard = ({ branch }) => {
  const navigate = useNavigate();

  const branchSlug = `${branch.name.replace(/\s+/g, "-").toLowerCase()}-${
    branch.id
  }`;

  // Parse JSON fields safely
  const paymentMethods = parseArray(branch.payment_methods);
  const popularDishes = parseArray(branch.popular_dishes);
  const offers = parseArray(branch.offers);

  return (
    <Card
      hoverable
      className="rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden"
      onClick={() => navigate(`/order-food/${branchSlug}`)}
    >
      <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
        <img
          src={branch.mainImage}
          alt={branch.name}
          className="w-full h-full object-cover transition-all duration-300 transform hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      <div className="p-3">
        <h3 className="text-lg font-semibold">{branch.name}</h3>
        <p className="text-gray-500 text-sm">{branch.address}</p>

        <div className="flex justify-between items-center mt-2 text-sm text-gray-700">
          <Rate
            disabled
            defaultValue={branch.average_rating}
            allowHalf
            className="text-xs"
          />
          <span>{branch.delivery_time}</span>
        </div>

        {/* {popularDishes.length > 0 && (
          <p className="text-sm mt-2">
            <b> 🔹Popular:</b> {popularDishes.slice(0, 2).join(", ")}
          </p>
        )} */}

        {/* {offers.length > 0 && (
          <div className="mt-2">
            <Tag color="green" className="animate-pulse">
              {offers[0]}
            </Tag>
          </div>
        )} */}
      </div>
    </Card>
  );
};

// Helper function to parse JSON safely
const parseArray = (data) => {
  try {
    return Array.isArray(data) ? data : JSON.parse(data || "[]");
  } catch {
    return [];
  }
};

export default BranchCard;
