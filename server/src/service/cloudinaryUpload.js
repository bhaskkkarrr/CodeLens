const cloudinaryUpload = async (profileUrl) => {
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(profileUrl, {
      folder: "CodeLens_Users",
    });
    console.log(cloudinaryResponse);
    url = cloudinaryResponse.secure_url;
    return {
      success: true,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default cloudinaryUpload;
