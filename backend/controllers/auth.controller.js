import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import redis from "../lib/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, {
    ex: 60 * 60 * 24 * 7,
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedName = name?.trim();

  if (!normalizedEmail || !password || !normalizedName) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const userExist = await User.findOne({ email: normalizedEmail });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    try {
      await storeRefreshToken(user._id, refreshToken);
    } catch (redisError) {
      console.log("Redis storeRefreshToken failed during signup:", redisError?.message);
    }

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const { refreshToken, accessToken } = generateTokens(user._id);

    try {
      await storeRefreshToken(user._id, refreshToken);
    } catch (redisError) {
      console.log("Redis storeRefreshToken failed during login:", redisError?.message);
    }

    setCookies(res, accessToken, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        try {
          await redis.del(`refresh_token:${decoded.userId}`);
        } catch (redisError) {
          console.log("Redis delete failed during logout:", redisError?.message);
        }
      } catch (jwtError) {
        console.log("Invalid refresh token during logout:", jwtError?.message);
      }
    }

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshTokenValue = req.cookies.refreshToken;

    if (!refreshTokenValue) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshTokenValue, process.env.REFRESH_TOKEN_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Refresh token expired. Please login again." });
      }

      return res.status(401).json({ message: "Invalid refresh token" });
    }

    try {
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (storedToken && storedToken !== refreshTokenValue) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    } catch (redisError) {
      console.log("Redis check failed during refresh:", redisError?.message);
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({
      message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    res.status(500).json({
      message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
  }
};
