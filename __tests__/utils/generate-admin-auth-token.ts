import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from "../../src/auth/middleware/super-admin.guard-middleware";

export function generateAdminAuthToken() {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials, "utf-8").toString("base64");

  return `Basic ${token}`;
}
