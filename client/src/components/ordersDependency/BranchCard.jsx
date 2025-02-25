import { useNavigate } from "react-router-dom";

const BranchCard = ({ branch }) => {
  const navigate = useNavigate();

  // Convert branch name to a URL-friendly slug
  const branchSlug = `${branch.name.replace(/\s+/g, "-").toLowerCase()}-${
    branch.id
  }`;

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/order-food/${branchSlug}`)}
    >
      <img
        src={branch.mainImage}
        alt={branch.name}
        className="w-full h-32 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-2">{branch.name}</h3>
      <p className="text-sm text-gray-500">{branch.address}</p>
      <p className="text-sm font-bold text-gray-700 mt-1">
        {branch.deliveryTime} mins
      </p>
    </div>
  );
};

export default BranchCard;
