import * as customerService from "../services/customerService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ===============================
   GET /api/customers
================================ */
export const getAllCustomers = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const customers = await customerService.getAllCustomers(
      Number(limit),
      Number(offset)
    );
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET /api/customers/:id
================================ */
export const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET /api/customers/:id/job-cards
   (ADMIN / STAFF VIEW)
================================ */
export const getCustomerJobCards = async (req, res) => {
  try {
    const customerId = Number(req.params.id);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const exists = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!exists) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const [jobCards, total] = await Promise.all([
      prisma.jobCard.findMany({
        where: { customerId },
        include: {
          vehicle: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.jobCard.count({ where: { customerId } }),
    ]);

    res.json({
      data: jobCards,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   GET /api/customers/me/job-cards
   (CUSTOMER SELF DASHBOARD)
================================ */
export const getMyJobCards = async (req, res) => {
  try {
    // Comes from JWT via authenticate middleware
    const customerId = req.user.id;

    const jobCards = await prisma.jobCard.findMany({
      where: { customerId },
      include: {
        vehicle: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobCards);
  } catch (error) {
    console.error("getMyJobCards error:", error);
    res.status(500).json({ error: "Failed to load job cards" });
  }
};

/* ===============================
   POST /api/customers
================================ */
export const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   PUT /api/customers/:id
================================ */
export const updateCustomer = async (req, res) => {
  try {
    const updated = await customerService.updateCustomer(
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ===============================
   DELETE /api/customers/:id
================================ */
export const deleteCustomer = async (req, res) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
