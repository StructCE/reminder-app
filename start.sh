#!/bin/sh
prisma db push --skip-generate
node server.js