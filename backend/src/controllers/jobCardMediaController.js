import prisma from '../config/database.js';

export const uploadMedia = async (req, res) => {
  const { jobCardId } = req.params;
  const { type } = req.body;

  const jobCard = await prisma.jobCard.findUnique({
    where: { id: Number(jobCardId) },
  });

  if (!jobCard) return res.status(404).json({ error: 'JobCard not found' });

  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const validTypes = ['IMAGE', 'VIDEO'];
  const fileType = validTypes.includes(type) ? type : 'IMAGE';

  const media = await prisma.jobCardMedia.create({
    data: {
      jobCardId: Number(jobCardId),
      fileType: fileType,
      fileUrl: req.file.path.replace(/\\/g, '/'),
    },
  });

  res.status(201).json({ id: media.id, url: media.fileUrl, type: media.fileType });
};

export const getMedia = async (req, res) => {
  const { jobCardId } = req.params;

  const jobCard = await prisma.jobCard.findUnique({
    where: { id: Number(jobCardId) },
  });

  if (!jobCard) return res.status(404).json({ error: 'JobCard not found' });

  const media = await prisma.jobCardMedia.findMany({
    where: { jobCardId: Number(jobCardId) },
    orderBy: { uploadedAt: 'desc' },
  });

  const formattedMedia = media.map((m) => ({
    id: m.id,
    url: m.filePath,
    type: m.mediaType,
    createdAt: m.uploadedAt,
  }));

  res.json(formattedMedia);
};

export const deleteMedia = async (req, res) => {
  const { jobCardId, mediaId } = req.params;
    const jobCard = await prisma.jobCard.findUnique({
        where: { id: Number(jobCardId) },
    });
    if (!jobCard) return res.status(404).json({ error: 'JobCard not found' });
    const media = await prisma.jobCardMedia.findUnique({
        where: { id: Number(mediaId) },
    });
    if (!media || media.jobCardId !== Number(jobCardId)) {
        return res.status(404).json({ error: 'Media not found for this JobCard' });
    }
    await prisma.jobCardMedia.delete({
        where: { id: Number(mediaId) },
    });
    res.status(200).json({ message: 'Media deleted successfully' });
}
