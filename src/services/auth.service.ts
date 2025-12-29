import prisma from '../database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_kunci_rahasia';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
};

type LoginInput = {
  email: string;
  password: string;
};

export const register = async (data: RegisterInput) => {
  // 1️⃣ VALIDASI INPUT (WAJIB)
  if (!data.name || !data.email || !data.password) {
    throw new Error('Nama, email, dan password wajib diisi');
  }

  // 2️⃣ CEK EMAIL DUPLIKAT (AMAN)
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  // 3️⃣ HASH PASSWORD
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 4️⃣ CREATE USER
  const user = await prisma.user.create({
    data: {
      username: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? 'USER',
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const login = async (data: LoginInput) => {
  // 1️⃣ VALIDASI INPUT
  if (!data.email || !data.password) {
    throw new Error('Email dan password wajib diisi');
  }

  // 2️⃣ CARI USER
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Email atau password salah');
  }

  // 3️⃣ CEK PASSWORD
  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    throw new Error('Email atau password salah');
  }

  // 4️⃣ GENERATE TOKEN
  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 5️⃣ RETURN DATA AMAN
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
