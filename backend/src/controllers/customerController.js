import * as customerService from '../services/customerService.js';

// GET /api/customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
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
    const { name, email, phone, address } = req.body;

    const errors = [];

    if (!name || name.trim() === '') errors.push('Name is required');
    if (!email || email.trim() === '') errors.push('Email is required');
    if (!phone || phone.trim() === '') errors.push('Phone is required');

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }

    const customer = await customerService.createCustomer({
      name,
      email,
      phone,
      address,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    if (email !== undefined && email.trim() === '') {
      return res.status(400).json({ error: 'Email cannot be empty' });
    }

    if (phone !== undefined && phone.trim() === '') {
      return res.status(400).json({ error: 'Phone cannot be empty' });
    }

    const updatedCustomer = await customerService.updateCustomer(id, {
      name,
      email,
      phone,
      address,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await customerService.deleteCustomer(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
