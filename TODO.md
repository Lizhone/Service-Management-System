# Fix Job Card Creation + Admin Dashboard Behavior

## Goals (in order)
1. Preserve all existing job cards and relationships
2. Make job card creation behavior explicit (existing vs new customer/vehicle)
3. Prevent confusion where different input names map to the same customer
4. Keep AdminDashboard rendering logic intact and correct
5. Make the smallest possible changes only

## Backend Rules
- If customerId present → reuse existing customer, ignore customerName/customerPhone
- If customerId NOT present → create new customer
- Same rule for vehicleId vs new vehicle fields
- DO NOT alter existing records or jobCardNumber format retroactively

## Frontend Rules
- Clearly separate "Create with existing customer" vs "Create new customer"
- Disable name/phone inputs when customerId is filled
- DO NOT assume customerName will override existing customer
- AdminDashboard must continue to render from relational data only

## Tasks
- [x] Update CreateJobCard.jsx to have two creation modes
- [x] Add customer/vehicle selection dropdowns for existing entities
- [x] Modify form to disable inputs when using existing entities
- [x] Update API calls to use appropriate endpoints
- [ ] Test that existing job cards 1-6 remain unchanged
- [ ] Test that new creation works for both modes
- [ ] Verify AdminDashboard still shows all job cards correctly
