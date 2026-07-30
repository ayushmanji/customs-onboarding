import { Response } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAdminOverview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBrokers = await prisma.user.count({ where: { role: 'BROKER' } });
    const totalCustomers = await prisma.customer.count();
    const totalExporters = await prisma.customer.count({ where: { customerType: 'EXPORTER' } });
    const totalImporters = await prisma.customer.count({ where: { customerType: 'IMPORTER' } });
    const totalDual = await prisma.customer.count({ where: { customerType: 'BOTH' } });

    const recentAuditLogs = await prisma.auditLog.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    return res.json({
      stats: {
        totalUsers,
        totalBrokers,
        totalCustomers,
        totalExporters,
        totalImporters,
        totalDual,
      },
      auditLogs: recentAuditLogs,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return res.status(500).json({ error: 'Failed to fetch admin overview statistics' });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        brokerLicenseNo: true,
        companyName: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { customers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users list' });
  }
};

export const getAllCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        broker: {
          select: { name: true, email: true, brokerLicenseNo: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ customers });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch global customers list' });
  }
};
