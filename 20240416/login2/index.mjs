import express from 'express';
import multer from 'multer';
import cors from "cors";
import moment from 'moment/';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const upload = multer();
const whiteList = ["http://localhost:5500"];