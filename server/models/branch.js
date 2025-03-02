module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define(
    "Branch",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      mainImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      delivery_time: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      opening_hours: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      delivery_area: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avg_cost_for_two: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_methods: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amenities: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      popular_dishes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      average_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      reviews_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      social_media: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      offers: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_person: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tagline: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      branch_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      scopes: {
        fullDetails: {
          attributes: [
            "id",
            "name",
            "address",
            "phone_number",
            "mainImage",
            "latitude",
            "longitude",
            "delivery_time",
            "category",
            "opening_hours",
            "delivery_area",
            "avg_cost_for_two",
            "payment_methods",
            "amenities",
            "popular_dishes",
            "average_rating",
            "reviews_count",
            "status",
            "social_media",
            "offers",
            "contact_person",
            "contact_email",
            "tagline",
            "branch_type",
          ],
        },
      },
    }
  );

  return Branch;
};
