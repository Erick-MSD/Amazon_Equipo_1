import { Router } from 'express';
import { Order, Product } from '../models';

const router = Router();

// Endpoint to get report of mayores ventas (top sales)
// This aggregates orders and groups by product to sum total quantities or total sales amount
router.get('/mayores-ventas', async (_req, res) => {
  try {
    // Aggregate orders by product and sum total quantity sold
    const ventas = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSales: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$_id",
          productName: "$product.name",
          totalSales: 1
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 10 }
    ]);

    res.json(ventas);
  } catch (error) {
    console.error('Error fetching mayores ventas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
