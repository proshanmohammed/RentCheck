import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  propertyType: z.enum([
    'Apartment',
    'Condominium',
    'Single-Family House',
    'Townhouse',
    'Studio',
    'Shared Room'
  ]),
  address: z.string().min(5, 'Valid address required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional().default('CA'),
  zipCode: z.string().optional().default(''),
  bedrooms: z.number().int().nonnegative().optional().default(1),
  bathrooms: z.number().nonnegative().optional().default(1.0),
  squareFeet: z.number().positive().optional().nullable(),
  baseRent: z.number().positive('Base rent must be greater than zero'),
  securityDeposit: z.number().nonnegative('Deposit cannot be negative'),
  recurringFees: z.number().nonnegative('Recurring fees cannot be negative').optional().default(0),
  feeDetails: z.record(z.string(), z.number()).optional().default({}),
  amenities: z.array(z.string()).optional().default([]),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  images: z.array(z.string().url('Invalid image URL format')).min(1, 'At least one image URL is required'),
  verificationEvidence: z.array(z.string().url('Invalid evidence URL format')).optional().default([]),
  landlordId: z.string().optional()
});

export const reportListingSchema = z.object({
  reason: z.string().min(3, 'Reason is required (at least 3 characters)'),
  details: z.string().optional().default(''),
  evidenceUrls: z.array(z.string().url()).optional().default([])
});

export const updateStatusSchema = z.object({
  verificationStatus: z.enum([
    'unverified',
    'pending_review',
    'verified',
    'flagged_duplicate',
    'suspicious'
  ]),
  moderationNotes: z.string().optional().default(''),
  resolveDuplicateFlagId: z.string().optional(),
  flagStatus: z.enum(['pending', 'confirmed_duplicate', 'false_positive']).optional()
});

export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.validatedBody = parsed;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'The submitted request data failed schema validation.',
          details: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
}
