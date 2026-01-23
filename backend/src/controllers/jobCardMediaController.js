import prisma from "../../prisma/client.js";

export const uploadJobCardMedia = async (req, res) => {
  try {
    // Validate jobCardId parameter
    const jobCardId = Number(req.params.id);
    if (!jobCardId || isNaN(jobCardId) || jobCardId <= 0) {
      return res.status(400).json({ error: "Invalid job card ID" });
    }

    // Validate multer file exists
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Validate file properties
    if (!req.file.filename || !req.file.path) {
      return res.status(400).json({ error: "File upload failed - missing file properties" });
    }

    // Determine and validate fileType
    const fileType = req.file.mimetype.startsWith("image") ? "IMAGE" : "VIDEO";
    if (!["IMAGE", "VIDEO"].includes(fileType)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    // Validate and sanitize context
    const validContexts = ["INSPECTION", "COMPLAINT", "PART_REPLACEMENT", "GENERAL"];
    const context = req.body.context || "GENERAL";
    if (!validContexts.includes(context)) {
      return res.status(400).json({ error: "Invalid context value" });
    }

    // Construct fileUrl
    const fileUrl = `/uploads/job-cards/${jobCardId}/${req.file.filename}`;

    // Save to database
    const media = await prisma.jobCardMedia.create({
      data: {
        jobCardId,
        fileUrl,
        fileType,
        context,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error("Media upload failed:", error);
    
    // Return appropriate error responses
    if (error.code === "P2025") {
      return res.status(400).json({ error: "Job card not found" });
    }
    if (error.message && error.message.includes("Invalid")) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: "Upload failed - please try again" });
  }
};

export const getJobCardMedia = async (req, res) => {
  const media = await prisma.jobCardMedia.findMany({
    where: { jobCardId: Number(req.params.id) },
  });
  res.json(media);
};

export const getJobCardMediaById = async (req, res) => {
  try {
    const mediaId = Number(req.params.mediaId);
    if (!mediaId || isNaN(mediaId) || mediaId <= 0) {
      return res.status(400).json({ error: "Invalid media ID" });
    }

    const media = await prisma.jobCardMedia.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Ensure the media belongs to the specified job card
    if (media.jobCardId !== Number(req.params.id)) {
      return res.status(404).json({ error: "Media not found for this job card" });
    }

    res.json(media);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};
