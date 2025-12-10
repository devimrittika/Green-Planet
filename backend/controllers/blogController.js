import asyncHandler from 'express-async-handler';
import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, topic, content, visibility } = req.body;

  // Validate required fields
  if (!title || !topic || !content) {
    res.status(400);
    throw new Error('Please provide title, topic, and content');
  }

  // Validate visibility
  const validVisibility = visibility || 'Public';
  if (!['Public', 'Community Only'].includes(validVisibility)) {
    res.status(400);
    throw new Error('Invalid visibility option');
  }

  // Create the blog post
  const blog = await Blog.create({
    user: req.user._id,
    title,
    topic,
    content,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    visibility: validVisibility,
  });

  if (blog) {
    // Get user and update their activities
    const user = await User.findById(req.user._id);
    
    // Create activity message
    const activityMessage = `${user.name} published a new blog: "${title}"`;

    // Add to user's activities
    user.activities.unshift({
      type: 'blog',
      message: activityMessage,
      createdAt: new Date(),
    });

    await user.save();

    // Populate user info for response
    const populatedBlog = await Blog.findById(blog._id).populate('user', 'name');

    res.status(201).json({
      _id: populatedBlog._id,
      title: populatedBlog.title,
      topic: populatedBlog.topic,
      content: populatedBlog.content,
      image: populatedBlog.image,
      visibility: populatedBlog.visibility,
      user: populatedBlog.user,
      createdAt: populatedBlog.createdAt,
      activity: {
        type: 'blog',
        message: activityMessage,
      },
      communityHighlight: {
        type: 'blog',
        title: title,
        author: user.name,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid blog data');
  }
});

// @desc    Get all public blogs (for community)
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ visibility: 'Public' })
    .populate('user', 'name profilePicture')
    .sort({ createdAt: -1 });
  res.json(blogs);
});

// @desc    Get community highlights (recent blogs for dashboard)
// @route   GET /api/blogs/highlights
// @access  Public
const getCommunityHighlights = asyncHandler(async (req, res) => {
  // Get recent public blogs as community highlights
  const blogs = await Blog.find({ visibility: 'Public' })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title topic user createdAt');

  const highlights = blogs.map(blog => ({
    _id: blog._id,
    type: 'blog',
    title: blog.title,
    topic: blog.topic,
    author: blog.user?.name || 'Anonymous',
    createdAt: blog.createdAt,
  }));

  res.json(highlights);
});

// @desc    Get user's blogs
// @route   GET /api/blogs/my
// @access  Private
const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(blogs);
});

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', 'name profilePicture');

  if (blog) {
    // Increment view count
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404);
    throw new Error('Blog not found');
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
  const { title, topic, content, visibility } = req.body;
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if user owns this blog
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this blog');
  }

  blog.title = title || blog.title;
  blog.topic = topic || blog.topic;
  blog.content = content || blog.content;
  blog.visibility = visibility || blog.visibility;

  if (req.file) {
    blog.image = `/uploads/${req.file.filename}`;
  }

  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Check if user owns this blog
  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this blog');
  }

  // Get user to remove activity
  const user = await User.findById(req.user._id);
  
  // Remove blog-related activities from user
  if (user && user.activities) {
    user.activities = user.activities.filter(
      activity => !(
        activity.type === 'blog' &&
        activity.message &&
        activity.message.includes(blog.title)
      )
    );
    await user.save();
  }

  // Note: Community highlights are fetched fresh from blogs, so deleting the blog
  // will automatically remove it from highlights on next fetch

  await blog.deleteOne();
  res.json({ message: 'Blog removed' });
});

export {
  createBlog,
  getAllBlogs,
  getCommunityHighlights,
  getMyBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};

