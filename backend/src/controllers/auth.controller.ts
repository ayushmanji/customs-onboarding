import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, brokerLicenseNo, companyName, phone, role } = req.body;

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    // Secure password hashing using bcrypt with cost factor 10
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        brokerLicenseNo: brokerLicenseNo || null,
        companyName: companyName || null,
        phone: phone || null,
        role: role || 'BROKER',
      },
    });

    // Create Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        details: `Broker ${user.name} (${user.email}) registered successfully`,
      },
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'customs_broker_onboarding_super_secret_jwt_key_2026';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: jwtExpiresIn as any }
    );

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        brokerLicenseNo: user.brokerLicenseNo,
        companyName: user.companyName,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during user registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password against stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        details: `Broker ${user.name} logged into dashboard`,
      },
    });

    const jwtSecret = process.env.JWT_SECRET || 'customs_broker_onboarding_super_secret_jwt_key_2026';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        brokerLicenseNo: user.brokerLicenseNo,
        companyName: user.companyName,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json({ user });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
