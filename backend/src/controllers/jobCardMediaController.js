import prisma from "../../prisma/client.js";

export const uploadJobCardMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File required" });
    }

    const fileType =
      req.file.mimetype.startsWith("image") ? "IMAGE" : "VIDEO";

    const media = await prisma.jobCardMedia.create({
      data: {
        jobCardId: Number(req.params.id),
        fileUrl: `/uploads/job-cards/${req.params.id}/${req.file.filename}`,
        fileType,
      },
    });

    res.status(201).json(media);
  } catch (error) {
    console.error("Media upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};

export const getJobCardMedia = async (req, res) => {
  const media = await prisma.jobCardMedia.findMany({
    where: { jobCardId: Number(req.params.id) },
  });
  res.json(media);
};
