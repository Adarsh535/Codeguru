/**
 * ============================================================================
 * MCP CONNECTOR: CODEGURU DATABASE (mcp/server.js)
 * ============================================================================
 * Claude ko website ke MongoDB database se jodta hai, taaki jo cheezein admin
 * panel se manually add/edit hoti hain (courses, banners, team, placements,
 * branches, categories, ads, nav menus, leads, enrollments, settings) wo
 * Claude se bol kar add/edit/delete ho sakein.
 *
 * Run: node mcp/server.js   (stdio transport - Claude Desktop / Claude Code)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { Ad } from '../models/Ad.js';
import { Banner } from '../models/Banner.js';
import { Branch } from '../models/Branch.js';
import { Category } from '../models/Category.js';
import { Counter } from '../models/Counter.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { Lead } from '../models/Lead.js';
import { NavMenu } from '../models/NavMenu.js';
import { Placement } from '../models/Placement.js';
import { Settings } from '../models/Settings.js';
import { Team } from '../models/Team.js';

// stdio par stdout sirf MCP messages ke liye hai - koi bhi log stderr par bhejo
console.log = console.error;
console.info = console.error;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true });

// Windows DNS fix (same as config/db.js) - Atlas SRV lookup ke liye
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // ignore
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ----------------------------------------------------------------------------
// ID generators (controllers jaisa hi format)
// ----------------------------------------------------------------------------

const nextSeq = async (key) => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return counter.seq;
};

const slugify = (text) => String(text || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

// ----------------------------------------------------------------------------
// Collections jo Claude manage kar sakta hai
// (Admin, Student, Submission, Analytics jaan-boojh kar bahar rakhe gaye hain)
// ----------------------------------------------------------------------------

const COLLECTIONS = {
  courses: {
    model: Course,
    about: 'Website par dikhne wale training courses (title, price, syllabus, projects, etc.)',
    sort: { order: 1, createdAt: -1 }
  },
  categories: {
    model: Category,
    about: 'Course categories aur sub-categories (coding, robotics, networking...). "category" field hi slug hai jo course.category se match hota hai.',
    altIdFields: ['id', 'category', 'label'],
    sort: { order: 1 },
    beforeCreate: async (data) => {
      const slug = slugify(data.category || data.label);
      return { ...data, id: data.id || slug, category: slug };
    }
  },
  banners: {
    model: Banner,
    about: 'Homepage hero slider banners (image ya video). mediaUrl zaroori hai.',
    sort: { order: 1, createdAt: -1 },
    beforeCreate: async (data) => {
      const mediaUrl = data.mediaUrl || data.imageUrl || data.videoUrl || '';
      const isVideo = data.type === 'video' || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(mediaUrl) || mediaUrl.includes('/video/');
      return {
        ...data,
        mediaUrl,
        type: isVideo ? 'video' : 'image',
        videoUrl: data.videoUrl || (isVideo ? mediaUrl : ''),
        imageUrl: data.imageUrl || (!isVideo ? mediaUrl : '')
      };
    }
  },
  ads: {
    model: Ad,
    about: 'Promotional ads / featured banners (position: home_featured, popup, header).',
    sort: { displayOrder: 1, createdAt: -1 }
  },
  branches: {
    model: Branch,
    about: 'Training campus / branch office locations.',
    sort: { createdAt: 1 }
  },
  team: {
    model: Team,
    about: 'Team members / mentors / instructors.',
    sort: { createdAt: 1 }
  },
  placements: {
    model: Placement,
    about: 'Placed students (name, company, package, photo).',
    sort: { createdAt: -1 },
    beforeCreate: async (data) => ({ ...data, studentName: data.studentName || data.name })
  },
  nav_menus: {
    model: NavMenu,
    about: 'Website navbar ke dropdown menus.',
    altIdFields: ['menuId'],
    sort: { createdAt: -1 },
    beforeCreate: async (data) => ({
      ...data,
      menuId: data.menuId || `NAV-${Date.now().toString(36).toUpperCase()}`
    })
  },
  leads: {
    model: Lead,
    about: 'Student admission inquiries. phone ya email me se ek zaroori.',
    altIdFields: ['leadId'],
    sort: { createdAt: -1 },
    beforeCreate: async (data) => ({
      ...data,
      leadId: data.leadId || `LEAD-${String(await nextSeq('leadId')).padStart(6, '0')}`
    })
  },
  enrollments: {
    model: Enrollment,
    about: 'Student enrollments aur fee/payment records.',
    altIdFields: ['enrollmentId'],
    sort: { createdAt: -1 },
    beforeCreate: async (data) => ({
      ...data,
      enrollmentId: data.enrollmentId || `ENR-${Date.now().toString().slice(-6)}`
    })
  }
};

const collectionNames = Object.keys(COLLECTIONS);
const collectionEnum = z.enum(collectionNames);

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

const SYSTEM_FIELDS = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

/** Mongoose schema ko readable field list me badalta hai, taaki Claude ko pata ho kya bharna hai */
const describeSchema = (schema) => {
  const fields = {};
  schema.eachPath((name, type) => {
    if (SYSTEM_FIELDS.has(name)) return;
    const info = { type: type.instance };
    if (type.isRequired) info.required = true;
    if (type.enumValues?.length) info.enum = type.enumValues;
    if (type.options?.enum && !info.enum) info.enum = type.options.enum.values || type.options.enum;
    const def = type.defaultValue;
    if (def !== undefined && typeof def !== 'function') info.default = def;
    if (type.instance === 'Array') {
      if (type.schema) {
        info.type = 'Array of objects';
        info.itemFields = describeSchema(type.schema);
      } else {
        const itemType = type.embeddedSchemaType?.instance || type.caster?.instance;
        if (itemType) info.type = `Array of ${itemType}`;
      }
    }
    fields[name] = info;
  });
  return fields;
};

const json = (data) => ({ content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] });

const fail = (message) => ({ content: [{ type: 'text', text: `Error: ${message}` }], isError: true });

/** _id ya alternate id (leadId, menuId, category slug...) se document dhoondta hai */
const findDoc = async (collection, id) => {
  const { model, altIdFields = [] } = COLLECTIONS[collection];
  const or = altIdFields.map((field) => ({ [field]: id }));
  if (mongoose.Types.ObjectId.isValid(id)) or.unshift({ _id: id });
  if (!or.length) return null;
  return model.findOne({ $or: or });
};

/** Schema me na hone wale fields (jo silently drop ho jaate) */
const unknownFields = (model, data) =>
  Object.keys(data).filter((key) => !SYSTEM_FIELDS.has(key) && !model.schema.path(key) && !model.schema.pathType(key).startsWith('nested'));

const createOne = async (collection, data) => {
  const { model, beforeCreate } = COLLECTIONS[collection];
  const payload = beforeCreate ? await beforeCreate(data) : data;
  const doc = await model.create(payload);
  return doc.toObject();
};

const textSearchFilter = (model, search) => {
  const regex = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  const or = [];
  model.schema.eachPath((name, type) => {
    if (type.instance === 'String' && !SYSTEM_FIELDS.has(name)) or.push({ [name]: regex });
  });
  return or.length ? { $or: or } : {};
};

// ----------------------------------------------------------------------------
// MCP server + tools
// ----------------------------------------------------------------------------

const server = new McpServer({ name: 'codeguru-database', version: '1.0.0' });

server.registerTool(
  'site_overview',
  {
    title: 'Website data overview',
    description: 'Saari collections ki list, har ek me kitne items hain, aur settings. Kaam shuru karne se pehle isse dekho.'
  },
  async () => {
    const counts = {};
    for (const name of collectionNames) {
      counts[name] = {
        about: COLLECTIONS[name].about,
        total: await COLLECTIONS[name].model.countDocuments()
      };
    }
    const settings = await Settings.findOne().lean();
    return json({ collections: counts, settings });
  }
);

server.registerTool(
  'describe_collection',
  {
    title: 'Collection ke fields',
    description: 'Kisi collection ke saare fields batata hai: type, required, default, allowed values (enum). Naya item banane se pehle zaroor dekho.',
    inputSchema: { collection: collectionEnum }
  },
  async ({ collection }) => {
    const { model, about, altIdFields } = COLLECTIONS[collection];
    const sample = await model.findOne().sort({ createdAt: -1 }).lean();
    return json({ collection, about, altIdFields: altIdFields || [], fields: describeSchema(model.schema), exampleItem: sample });
  }
);

server.registerTool(
  'list_items',
  {
    title: 'Items ki list',
    description: 'Collection ke items laata hai. "search" se kisi bhi text field me dhoondh sakte ho, "filter" me MongoDB query de sakte ho (e.g. {"category":"coding","isActive":true}).',
    inputSchema: {
      collection: collectionEnum,
      search: z.string().optional().describe('Text jo kisi bhi field me dhoondhna hai'),
      filter: z.record(z.any()).optional().describe('MongoDB filter object'),
      fields: z.array(z.string()).optional().describe('Sirf ye fields laao (e.g. ["title","price"])'),
      limit: z.number().int().min(1).max(500).default(50),
      skip: z.number().int().min(0).default(0)
    }
  },
  async ({ collection, search, filter, fields, limit, skip }) => {
    const { model, sort } = COLLECTIONS[collection];
    const query = { ...(filter || {}), ...(search ? textSearchFilter(model, search) : {}) };
    const [items, total] = await Promise.all([
      model.find(query).select(fields?.length ? fields.join(' ') : '').sort(sort).skip(skip).limit(limit).lean(),
      model.countDocuments(query)
    ]);
    return json({ collection, total, returned: items.length, skip, items });
  }
);

server.registerTool(
  'get_item',
  {
    title: 'Ek item dekho',
    description: 'Ek item ki poori detail. id me MongoDB _id ya alternate id (leadId, menuId, enrollmentId, category slug) de sakte ho.',
    inputSchema: { collection: collectionEnum, id: z.string() }
  },
  async ({ collection, id }) => {
    const doc = await findDoc(collection, id);
    return doc ? json(doc.toObject()) : fail(`${collection} me "${id}" nahi mila`);
  }
);

server.registerTool(
  'create_item',
  {
    title: 'Naya item add karo',
    description: 'Collection me ek naya item add karta hai. Fields jaanne ke liye pehle describe_collection chalao. IDs (leadId, menuId, enrollmentId, category slug) apne aap ban jaate hain.',
    inputSchema: { collection: collectionEnum, data: z.record(z.any()) }
  },
  async ({ collection, data }) => {
    const ignored = unknownFields(COLLECTIONS[collection].model, data);
    const doc = await createOne(collection, data);
    return json({ created: doc, ...(ignored.length && { warning: `Ye fields schema me nahi hain isliye save nahi hue: ${ignored.join(', ')}` }) });
  }
);

server.registerTool(
  'create_many',
  {
    title: 'Ek saath bahut saare items add karo',
    description: 'Ek hi collection me kai items ek saath add karta hai (e.g. 10 courses). Har item alag se validate hota hai; jo fail ho uska reason bataya jaata hai.',
    inputSchema: { collection: collectionEnum, items: z.array(z.record(z.any())).min(1).max(200) }
  },
  async ({ collection, items }) => {
    const created = [];
    const failed = [];
    for (const [index, data] of items.entries()) {
      try {
        const doc = await createOne(collection, data);
        created.push({ index, _id: doc._id });
      } catch (err) {
        failed.push({ index, error: err.message });
      }
    }
    return json({ collection, createdCount: created.length, failedCount: failed.length, created, failed });
  }
);

server.registerTool(
  'update_item',
  {
    title: 'Item edit karo',
    description: 'Existing item ke sirf diye gaye fields badalta hai, baaki waise hi rehte hain. Arrays (technologies, syllabusModules...) poore replace hote hain.',
    inputSchema: { collection: collectionEnum, id: z.string(), data: z.record(z.any()) }
  },
  async ({ collection, id, data }) => {
    const doc = await findDoc(collection, id);
    if (!doc) return fail(`${collection} me "${id}" nahi mila`);
    const ignored = unknownFields(COLLECTIONS[collection].model, data);
    const changes = Object.fromEntries(Object.entries(data).filter(([key]) => !SYSTEM_FIELDS.has(key)));
    doc.set(changes);
    await doc.save();
    return json({ updated: doc.toObject(), ...(ignored.length && { warning: `Ye fields schema me nahi hain isliye save nahi hue: ${ignored.join(', ')}` }) });
  }
);

server.registerTool(
  'update_many',
  {
    title: 'Bahut saare items ek saath edit karo',
    description: 'Filter se match hone wale saare items par same badlav (e.g. saare "coding" courses ka batchMode badlo).',
    inputSchema: { collection: collectionEnum, filter: z.record(z.any()), data: z.record(z.any()) }
  },
  async ({ collection, filter, data }) => {
    const result = await COLLECTIONS[collection].model.updateMany(filter, { $set: data }, { runValidators: true });
    return json({ matched: result.matchedCount, modified: result.modifiedCount });
  }
);

server.registerTool(
  'delete_item',
  {
    title: 'Item delete karo',
    description: 'Ek item hamesha ke liye delete karta hai. Sirf tab use karo jab user ne saaf delete karne ko bola ho. Chhupana ho to isActive/active/isHidden field update karo.',
    inputSchema: { collection: collectionEnum, id: z.string() },
    annotations: { destructiveHint: true }
  },
  async ({ collection, id }) => {
    const doc = await findDoc(collection, id);
    if (!doc) return fail(`${collection} me "${id}" nahi mila`);
    await doc.deleteOne();
    return json({ deleted: doc.toObject() });
  }
);

server.registerTool(
  'get_settings',
  {
    title: 'Website settings dekho',
    description: 'Site title, admin phone/email, WhatsApp settings, nav toggles.'
  },
  async () => {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    return json({ settings: settings.toObject(), fields: describeSchema(Settings.schema) });
  }
);

server.registerTool(
  'update_settings',
  {
    title: 'Website settings badlo',
    description: 'Settings ke diye gaye fields update karta hai (e.g. {"siteTitle":"...","adminPhone":"..."}).',
    inputSchema: { data: z.record(z.any()) }
  },
  async ({ data }) => {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    const changes = Object.fromEntries(Object.entries(data).filter(([key]) => !SYSTEM_FIELDS.has(key)));
    settings.set(changes);
    await settings.save();
    return json({ updated: settings.toObject() });
  }
);

server.registerTool(
  'upload_image',
  {
    title: 'Image/video upload karo',
    description: 'Computer ki file (poora path) ya kisi internet URL ki image/video Cloudinary par upload karke uska URL deta hai. Ye URL fir photo, logoUrl, imageUrl, mediaUrl jaise fields me daalo.',
    inputSchema: {
      source: z.string().describe('Local file path (e.g. C:\\Users\\...\\photo.jpg) ya https:// URL'),
      folder: z.string().default('codeguru').describe('Cloudinary folder, e.g. codeguru/team')
    }
  },
  async ({ source, folder }) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return fail('Cloudinary keys backend/.env me set nahi hain');
    }
    const result = await cloudinary.uploader.upload(source, { folder, resource_type: 'auto' });
    return json({ url: result.secure_url, type: result.resource_type, width: result.width, height: result.height });
  }
);

// ----------------------------------------------------------------------------
// Start
// ----------------------------------------------------------------------------

const main = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI backend/.env me nahi mila');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI.trim(), { serverSelectionTimeoutMS: 15000 });
  console.error(`CodeGuru MCP connected to MongoDB: ${mongoose.connection.name}`);
  await server.connect(new StdioServerTransport());
};

main().catch((err) => {
  console.error('CodeGuru MCP start failed:', err.message);
  process.exit(1);
});
