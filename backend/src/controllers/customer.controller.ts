import { Response } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const onboardCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User must be authenticated' });
    }

    const {
      name,
      tradeName,
      email,
      phone,
      customerType,
      gstin,
      iec,
      pan,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const formattedGstin = gstin.toUpperCase();

    // Check if customer with same GSTIN already onboarded under this broker
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        brokerId: req.user.id,
        gstin: formattedGstin,
      },
    });

    if (existingCustomer) {
      return res.status(400).json({
        error: `Customer with GSTIN ${formattedGstin} is already onboarded under your account`,
      });
    }

    // Save to database via Prisma (PostgreSQL / SQLite)
    const customer = await prisma.customer.create({
      data: {
        brokerId: req.user.id,
        name,
        tradeName: tradeName || null,
        email: email.toLowerCase(),
        phone,
        customerType,
        gstin: formattedGstin,
        iec: iec ? iec.toUpperCase() : null,
        pan: pan ? pan.toUpperCase() : formattedGstin.substring(2, 12),
        address,
        city,
        state,
        pincode,
        status: 'VERIFIED',
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'CUSTOMER_ONBOARDED',
        details: `Broker ${req.user.name} onboarded ${customerType} '${name}' (GSTIN: ${formattedGstin})`,
      },
    });

    return res.status(201).json({
      message: 'Customer onboarded successfully',
      customer,
    });
  } catch (error: any) {
    console.error('Onboard customer error:', error);
    return res.status(500).json({ error: 'Failed to onboard customer profile' });
  }
};

export const getBrokerCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User must be authenticated' });
    }

    const { search, type, status } = req.query;

    const whereClause: any = {
      brokerId: req.user.id,
    };

    if (type && ['EXPORTER', 'IMPORTER', 'BOTH'].includes(type as string)) {
      whereClause.customerType = type as string;
    }

    if (status) {
      whereClause.status = status as string;
    }

    if (search) {
      const query = (search as string).toLowerCase();
      whereClause.OR = [
        { name: { contains: query } },
        { gstin: { contains: query } },
        { email: { contains: query } },
        { phone: { contains: query } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate broker overview summary stats
    const totalCustomers = customers.length;
    const totalExporters = customers.filter(c => c.customerType === 'EXPORTER' || c.customerType === 'BOTH').length;
    const totalImporters = customers.filter(c => c.customerType === 'IMPORTER' || c.customerType === 'BOTH').length;
    const totalVerified = customers.filter(c => c.status === 'VERIFIED').length;

    return res.json({
      stats: {
        totalCustomers,
        totalExporters,
        totalImporters,
        totalVerified,
      },
      customers,
    });
  } catch (error: any) {
    console.error('Get customers error:', error);
    return res.status(500).json({ error: 'Failed to retrieve onboarded customers' });
  }
};

export const getCustomerById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User must be authenticated' });
    }

    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
        brokerId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer record not found' });
    }

    return res.json({ customer });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch customer details' });
  }
};

export const verifyGstin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { gstin } = req.body;
    const cleanGstin = gstin.toUpperCase();

    // Mock Govt GSTIN & IEC lookup simulation for Customs Broker engine
    const stateCode = cleanGstin.substring(0, 2);
    const panFromGstin = cleanGstin.substring(2, 12);
    
    // Quick mock validation output
    return res.json({
      verified: true,
      gstin: cleanGstin,
      pan: panFromGstin,
      legalName: "EXEMPLAR TRADING & LOGISTICS PRIVATE LIMITED",
      taxpayerType: "Regular Exporter/Importer",
      registrationDate: "2021-04-15",
      gstinStatus: "ACTIVE",
      jurisdiction: `State Zone ${stateCode}`,
      iecStatus: "ACTIVE & VERIFIED FOR CUSTOMS CLEARANCE",
    });
  } catch (error) {
    return res.status(500).json({ error: 'GSTIN verification service failed' });
  }
};
