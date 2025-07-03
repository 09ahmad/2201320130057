import express, { type Request, type Response } from "express";
import cors from "express";
import { urlSchema } from "../validation/urlValidation";
import { generateShortcode } from "../utils/generateShortUrl";
import { client } from "../model/db";
import {addMinutes , isAfter } from "date-fns"
const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();

router.post("/shortner", async (req: Request, res: Response) => {
  const body = req.body;
  const parse = urlSchema.safeParse(body);
  if (!parse.success) {
    res.status(402).json({
      msg: "Invlid input",
    });
    return;
  }

  const { url, shortcode, validity = 30 } = body;
  let code = shortcode;
  let tries = 0;
  while (true) {
    if (!code) code = generateShortcode();
    const exists = await client.shortUrl.findUnique({
      where: { shortcode: code },
    });
    if (!exists) break;
    if (shortcode) {
      code = undefined;
    }
    tries++;
    if (tries > 5) {
      res.status(500).json({ msg: "Could not generate unique shortcode" });
      return;
    }
  }
  const now = new Date();
  const expiry = addMinutes(now, validity);
  const shortUrl = await client.shortUrl.create({
    data: {
      shortcode: code!,
      originalUrl: url,
      createdAt: now,
      expiry,
    },
  });
   const host = req.protocol + '://' + req.get('host');
    res.status(201).json({
    shortLink: `${host}/${shortUrl.shortcode}`,
    expiry: shortUrl.expiry.toISOString(),
  });
  return;
});


router.get('/shorturls/:shortcode', async (req: any, res: any) => {
  const { shortcode } = req.params;
  const shortUrl = await client.shortUrl.findUnique({
    where: { shortcode },
    include: { clickData: true },
  });
  if (!shortUrl) return res.status(404).json({ error: 'Shortcode not found' });
  return res.json({
    originalUrl: shortUrl.originalUrl,
    createdAt: shortUrl.createdAt,
    expiry: shortUrl.expiry,
  });
});
export default router