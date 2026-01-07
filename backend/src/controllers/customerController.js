import * as customerService from '../services/customerService.js';

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await customerService.getAllCustomers(limit, offset);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res) => {

  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, mobileNumber, address, gstNumber, notes } = req.body;

    const errors = [];

    if (!name || name.trim() === '') errors.push('Name is required');
    if (!mobileNumber || mobileNumber.trim() === '') errors.push('Mobile number is required');

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const customer = await customerService.createCustomer({
      name,
      mobileNumber,
      address,
      gstNumber,
      notes,
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobileNumber, address, gstNumber, notes } = req.body;

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    if (mobileNumber !== undefined && mobileNumber.trim() === '') {
      return res.status(400).json({ error: 'Mobile number cannot be empty' });
    }

    const updatedCustomer = await customerService.updateCustomer(id, {
      name,
      mobileNumber,
      address,
      gstNumber,
      notes,
    });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await customerService.deleteCustomer(id);

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
