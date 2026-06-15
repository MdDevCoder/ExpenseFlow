import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import generateToken from '../utils/generateToken';

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await (user as any).matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currency: user.currency,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, currency } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: password,
    currency: currency || 'USD',
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currency: user.currency,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      currency: user.currency,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
