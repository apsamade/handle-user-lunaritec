import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 465,
    secure: (process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : 465) === 465,
    auth: {
      user: process.env.MON_MAIL,
      pass: process.env.MON_MDP,
    },

    tls: {
      rejectUnauthorized: false,
      servername: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
      secureProtocol: 'TLSv1_2_method',
      ciphers: 'ALL',
    },

    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    ...(process.env.NODE_ENV === 'development' && {
      debug: true,
      logger: true,
    }),
  });
};

export const createAlternativeTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.MON_MAIL,
      pass: process.env.MON_MDP,
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3',
    },
    requireTLS: true,
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
  });
}; 