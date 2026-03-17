const updateProfile = async (req, res) => {
  try {
    const { name, role, bio } = req.body;

    const updateData = { name, role, bio };

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export {updateProfile};