/**
 * ============================================================================
 * CONTROLLER: COURSE CATEGORIES CONTROLLER (categoryController.js)
 * ============================================================================
 * Handles CRUD operations for technology course categories.
 */

import { Category } from '../../models/Category.js';

const DEFAULT_CATEGORIES = [
  {
    id: 'coding',
    label: 'Software Development',
    category: 'coding',
    subCat: 'web',
    subCategories: [
      { id: 'web', label: 'Web Dev' },
      { id: 'app', label: 'App Dev' },
      { id: 'ai', label: 'AI & ML' }
    ],
    icon: '/images/categories/coding.png',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'robotics',
    label: 'Robotics & IoT',
    category: 'robotics',
    subCat: 'hardware',
    subCategories: [
      { id: 'hardware', label: 'Robotics' },
      { id: 'iot', label: 'IoT' },
      { id: 'embedded', label: 'Embedded' }
    ],
    icon: '/images/categories/robotics.png',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'networking',
    label: 'Networking & Server',
    category: 'networking',
    subCat: 'server',
    subCategories: [
      { id: 'server', label: 'Server & CCNA' },
      { id: 'cloud', label: 'Cloud & AWS' },
      { id: 'cyber', label: 'Cyber Security' }
    ],
    icon: '/images/categories/networking.png',
    bgColor: 'bg-cyan-50'
  },
  {
    id: 'repair',
    label: 'Computer & Mobile Repair',
    category: 'repair',
    subCat: 'mobile',
    subCategories: [
      { id: 'mobile', label: 'Mobile Repair' },
      { id: 'laptop', label: 'Laptop & PC' },
      { id: 'bga', label: 'BGA IC' }
    ],
    icon: '/images/categories/repair.png',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'electrical',
    label: 'Home Appliance Repair',
    category: 'electrical',
    subCat: 'ac',
    subCategories: [
      { id: 'ac', label: 'AC & Fridge' },
      { id: 'pcb', label: 'PCB Repair' }
    ],
    icon: '/images/categories/electrical.png',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'marketing',
    label: 'Digital Marketing',
    category: 'marketing',
    subCat: 'ads',
    subCategories: [
      { id: 'ads', label: 'Performance Ads' },
      { id: 'seo', label: 'SEO & Media' }
    ],
    icon: '/images/categories/marketing.png',
    bgColor: 'bg-rose-50'
  }
];

/**
 * @route   GET /api/categories
 * @desc    Fetch all course categories
 * @access  Public / Admin
 */
export const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ createdAt: 1 });
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ createdAt: 1 });
    }
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   POST /api/categories
 * @desc    Create a new course category
 * @access  Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { label, category, subCat, subCategories, badge, icon, bgColor } = req.body;
    
    if (!label) {
      return res.status(400).json({ success: false, message: 'Category label is required' });
    }

    const catSlug = (category && category.trim()) 
      ? category.trim().toLowerCase().replace(/[^a-z0-9]/g, '') 
      : label.toLowerCase().replace(/[^a-z0-9]/g, '');

    let existing = await Category.findOne({ $or: [{ category: catSlug }, { id: catSlug }] });
    if (existing) {
      // Update existing category instead of failing
      existing.label = label;
      if (badge) existing.badge = badge;
      if (icon) existing.icon = icon;
      if (Array.isArray(subCategories) && subCategories.length > 0) {
        existing.subCategories = subCategories;
      }
      await existing.save();
      return res.status(200).json({ success: true, data: existing, message: `Category '${label}' updated successfully` });
    }

    const newCategory = new Category({
      id: catSlug,
      label,
      category: catSlug,
      subCat: subCat || 'all',
      subCategories: Array.isArray(subCategories) ? subCategories : [],
      badge: badge || '',
      icon: icon || '',
      bgColor: bgColor || 'bg-blue-50'
    });

    await newCategory.save();
    return res.status(201).json({ success: true, data: newCategory, message: `Category '${label}' created successfully` });
  } catch (error) {
    console.error('[categoryController createCategory Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error creating category' });
  }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update existing course category
 * @access  Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;
    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    }
    if (!updated) {
      updated = await Category.findOneAndUpdate(
        { $or: [{ category: id }, { id: id }] },
        req.body,
        { new: true }
      );
    }
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('[categoryController updateCategory Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a course category
 * @access  Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      deleted = await Category.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Category.findOneAndDelete({ category: id });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
